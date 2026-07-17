/**
 * GET /api/admin/stats — top-line numbers for the admin dashboard.
 * Admin-only — see src/lib/supabase/serverAuth.ts's requireAdmin.
 */
import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/supabase/serverAuth";
import { ordersService } from "@/services/orders";
import { profilesService } from "@/services/profiles";
import { withdrawalsService } from "@/services/withdrawals";

export async function GET(req: NextRequest) {
  const admin = await requireAdmin(req);
  if (!admin) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const [orderStats, userCount, withdrawals] = await Promise.all([
    ordersService.getOrderStats(),
    profilesService.countProfiles(),
    withdrawalsService.listAll(),
  ]);

  if (orderStats.error) {
    return NextResponse.json({ error: orderStats.error }, { status: 500 });
  }
  if (userCount.error) {
    return NextResponse.json({ error: userCount.error }, { status: 500 });
  }

  const pendingWithdrawals = (withdrawals.data ?? []).filter(
    (w) => w.status === "pending"
  );

  return NextResponse.json({
    ...orderStats.data,
    totalUsers: userCount.data ?? 0,
    pendingWithdrawalCount: pendingWithdrawals.length,
    pendingWithdrawalAmount: Number(
      pendingWithdrawals.reduce((sum, w) => sum + w.amount, 0).toFixed(2)
    ),
  });
}
