/**
 * Referrals Service — V1.5 Product Transformation.
 *
 * Server-only (imports the service-role admin client + `walletService`).
 * Two responsibilities:
 *
 *   1. `getReferralStats(userId)` — read-only summary for the dashboard
 *      referrals page: the user's own referral code/link, how many people
 *      they've referred, and their commission history.
 *   2. `creditCommission(order)` — called from the Paystack webhook right
 *      after an order is marked `payment_status = "paid"`. Idempotent by
 *      construction: it INSERTs into `referral_commissions` first (which
 *      has a unique constraint on `order_reference`) and only credits the
 *      referrer's wallet if that insert actually happened. If the webhook
 *      fires twice for the same order (Paystack does not guarantee
 *      exactly-once delivery), the second insert fails with a unique
 *      violation and the wallet is never double-credited — this is a
 *      stronger idempotency guarantee than a "check then insert" pattern
 *      would give under a race.
 */
import { supabaseAdminClient } from "@/lib/supabase/admin";
import { walletService } from "@/services/wallet";
import {
  mapReferralCommissionRow,
  DEFAULT_COMMISSION_RATE,
  type ReferralStats,
} from "@/types/referral";
import type { OrderRecord } from "@/types/order";
import type { ApiResponse } from "@/types";

/** Postgres unique_violation error code — used to distinguish "this order
 * already has a commission" (expected, not an error) from a real failure. */
const UNIQUE_VIOLATION = "23505";

async function getReferralStats(
  userId: string
): Promise<ApiResponse<ReferralStats>> {
  const profileResult = await supabaseAdminClient
    .from("profiles")
    .select("referral_code")
    .eq("id", userId)
    .maybeSingle();

  if (profileResult.error) {
    return { data: null, error: profileResult.error.message };
  }

  const [referredCountResult, commissionsResult] = await Promise.all([
    supabaseAdminClient
      .from("profiles")
      .select("id", { count: "exact", head: true })
      .eq("referred_by", userId),
    supabaseAdminClient
      .from("referral_commissions")
      .select()
      .eq("referrer_id", userId)
      .order("created_at", { ascending: false }),
  ]);

  if (referredCountResult.error) {
    return { data: null, error: referredCountResult.error.message };
  }
  if (commissionsResult.error) {
    return { data: null, error: commissionsResult.error.message };
  }

  const commissions = (commissionsResult.data ?? []).map(
    mapReferralCommissionRow
  );
  const totalEarned = Number(
    commissions.reduce((sum, c) => sum + c.commissionAmount, 0).toFixed(2)
  );

  return {
    data: {
      referralCode: profileResult.data?.referral_code ?? null,
      referredCount: referredCountResult.count ?? 0,
      totalEarned,
      commissions,
    },
    error: null,
  };
}

/** Credits the referrer of a just-paid order, if any. Safe to call for
 * every paid order unconditionally — resolves to a no-op (not an error)
 * when the buyer wasn't referred by anyone, or when this order already
 * has a recorded commission. */
async function creditCommission(
  order: OrderRecord
): Promise<ApiResponse<{ credited: boolean }>> {
  if (!order.userId) {
    // Guest checkout — no account, so no referrer to credit.
    return { data: { credited: false }, error: null };
  }

  const buyerProfile = await supabaseAdminClient
    .from("profiles")
    .select("referred_by")
    .eq("id", order.userId)
    .maybeSingle();

  if (buyerProfile.error) {
    return { data: null, error: buyerProfile.error.message };
  }

  const referrerId = buyerProfile.data?.referred_by;
  if (!referrerId) {
    return { data: { credited: false }, error: null };
  }

  const commissionAmount = Number(
    (order.amount * DEFAULT_COMMISSION_RATE).toFixed(2)
  );

  const insertResult = await supabaseAdminClient
    .from("referral_commissions")
    .insert({
      referrer_id: referrerId,
      referred_user_id: order.userId,
      order_reference: order.reference,
      order_amount: order.amount,
      commission_rate: DEFAULT_COMMISSION_RATE,
      commission_amount: commissionAmount,
    })
    .select()
    .single();

  if (insertResult.error) {
    // Already recorded for this order (duplicate webhook delivery) —
    // not an error, just a no-op.
    if (insertResult.error.code === UNIQUE_VIOLATION) {
      return { data: { credited: false }, error: null };
    }
    return { data: null, error: insertResult.error.message };
  }

  const creditResult = await walletService.credit(
    referrerId,
    commissionAmount,
    `Referral commission — order ${order.reference}`,
    order.reference
  );

  if (creditResult.error) {
    // The commission row exists but the wallet credit failed. Surface the
    // error rather than silently losing it — a future reconciliation job
    // could scan for referral_commissions rows with no matching
    // wallet_transactions row keyed by the same reference.
    return { data: null, error: creditResult.error };
  }

  return { data: { credited: true }, error: null };
}

/** Admin-only: platform-wide referral analytics — top referrers by total
 * commission earned, and the overall commission total paid out. Computed
 * from a single bounded fetch (see `ordersService.getOrderStats`'s doc
 * comment for the same "acceptable at this scale" reasoning). */
async function getAdminAnalytics(): Promise<
  ApiResponse<{
    totalCommissionsPaid: number;
    totalCommissionCount: number;
    topReferrers: Array<{
      referrerId: string;
      referrerEmail: string;
      referredCount: number;
      totalEarned: number;
    }>;
  }>
> {
  const commissionsResult = await supabaseAdminClient
    .from("referral_commissions")
    .select("referrer_id, commission_amount")
    .limit(5000);

  if (commissionsResult.error) {
    return { data: null, error: commissionsResult.error.message };
  }

  const rows = commissionsResult.data ?? [];
  const totalCommissionsPaid = Number(
    rows.reduce((sum, r) => sum + Number(r.commission_amount), 0).toFixed(2)
  );

  const byReferrer = new Map<string, number>();
  for (const row of rows) {
    byReferrer.set(
      row.referrer_id,
      (byReferrer.get(row.referrer_id) ?? 0) + Number(row.commission_amount)
    );
  }

  const topIds = [...byReferrer.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([id]) => id);

  if (topIds.length === 0) {
    return {
      data: { totalCommissionsPaid, totalCommissionCount: rows.length, topReferrers: [] },
      error: null,
    };
  }

  const [profilesResult, referredCounts] = await Promise.all([
    supabaseAdminClient.from("profiles").select("id, email").in("id", topIds),
    supabaseAdminClient.from("profiles").select("referred_by").in("referred_by", topIds),
  ]);

  if (profilesResult.error) {
    return { data: null, error: profilesResult.error.message };
  }

  const emailById = new Map(
    (profilesResult.data ?? []).map((p) => [p.id, p.email])
  );
  const referredCountById = new Map<string, number>();
  for (const row of referredCounts.data ?? []) {
    if (!row.referred_by) continue;
    referredCountById.set(
      row.referred_by,
      (referredCountById.get(row.referred_by) ?? 0) + 1
    );
  }

  const topReferrers = topIds.map((id) => ({
    referrerId: id,
    referrerEmail: emailById.get(id) ?? "Unknown",
    referredCount: referredCountById.get(id) ?? 0,
    totalEarned: Number((byReferrer.get(id) ?? 0).toFixed(2)),
  }));

  return {
    data: { totalCommissionsPaid, totalCommissionCount: rows.length, topReferrers },
    error: null,
  };
}

export const referralsService = {
  getReferralStats,
  creditCommission,
  getAdminAnalytics,
};
