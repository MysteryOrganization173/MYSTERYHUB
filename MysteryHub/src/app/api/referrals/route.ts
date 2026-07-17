/**
 * GET /api/referrals — the signed-in user's referral code, stats, and
 * commission history. Powers `/dashboard/referrals`. Requires a
 * signed-in user.
 */
import { NextRequest, NextResponse } from "next/server";
import { getUserFromRequest } from "@/lib/supabase/serverAuth";
import { referralsService } from "@/services/referrals";

export async function GET(req: NextRequest) {
  const user = await getUserFromRequest(req);
  if (!user) {
    return NextResponse.json({ error: "Sign in required" }, { status: 401 });
  }

  const result = await referralsService.getReferralStats(user.id);
  if (result.error || !result.data) {
    return NextResponse.json({ error: result.error ?? "Failed to load referral stats" }, { status: 500 });
  }
  return NextResponse.json(result.data);
}
