/**
 * Referral domain types — V1.5 Product Transformation.
 *
 * Distinct from the legacy `Referral` shape in `src/types/index.ts` (which
 * was never backed by a table — see docs/product-audit.md). This file is
 * the active, real referral-commission model, backed by
 * `public.referral_commissions` (see
 * supabase/migrations/0003_wallet_referrals_suppliers.sql).
 */
import type { Database } from "./database";

/** Default commission rate applied to a referred user's paid order.
 * Placeholder business decision (matches the pre-existing homepage
 * marketing copy, "Up to 5%") — change here, not per-call, if the rate
 * changes; already-recorded commissions keep their own stored rate. */
export const DEFAULT_COMMISSION_RATE = 0.05;

export type ReferralCommissionRow =
  Database["public"]["Tables"]["referral_commissions"]["Row"];

export interface ReferralCommissionRecord {
  id: string;
  referrerId: string;
  referredUserId: string;
  orderReference: string;
  orderAmount: number;
  commissionRate: number;
  commissionAmount: number;
  createdAt: string;
}

export function mapReferralCommissionRow(
  row: ReferralCommissionRow
): ReferralCommissionRecord {
  return {
    id: row.id,
    referrerId: row.referrer_id,
    referredUserId: row.referred_user_id,
    orderReference: row.order_reference,
    orderAmount: row.order_amount,
    commissionRate: row.commission_rate,
    commissionAmount: row.commission_amount,
    createdAt: row.created_at,
  };
}

export interface ReferralStats {
  referralCode: string | null;
  referredCount: number;
  totalEarned: number;
  commissions: ReferralCommissionRecord[];
}
