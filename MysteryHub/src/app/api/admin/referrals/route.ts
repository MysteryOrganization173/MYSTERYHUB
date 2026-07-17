/**
 * GET /api/admin/referrals — platform-wide referral analytics.
 * Admin-only. Powers /admin/referrals (repurposed from the old
 * /admin/agents placeholder — see docs/product-audit.md).
 */
import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/supabase/serverAuth";
import { referralsService } from "@/services/referrals";
import { withdrawalsService } from "@/services/withdrawals";

export async function GET(req: NextRequest) {
  const admin = await requireAdmin(req);
  if (!admin) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const [analytics, withdrawals] = await Promise.all([
    referralsService.getAdminAnalytics(),
    withdrawalsService.listAll(),
  ]);

  if (analytics.error || !analytics.data) {
    return NextResponse.json(
      { error: analytics.error ?? "Failed to load referral analytics" },
      { status: 500 }
    );
  }

  const pending = (withdrawals.data ?? []).filter((w) => w.status === "pending");

  return NextResponse.json({
    ...analytics.data,
    pendingWithdrawalCount: pending.length,
    pendingWithdrawalAmount: Number(
      pending.reduce((sum, w) => sum + w.amount, 0).toFixed(2)
    ),
  });
}
