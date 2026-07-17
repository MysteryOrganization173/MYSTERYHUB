/**
 * GET /api/wallet — current user's wallet balance + transaction history.
 *
 * Requires a signed-in user (`Authorization: Bearer <token>` — see
 * src/lib/supabase/serverAuth.ts). Returns 401 otherwise; there is no
 * guest wallet.
 */
import { NextRequest, NextResponse } from "next/server";
import { getUserFromRequest } from "@/lib/supabase/serverAuth";
import { walletService } from "@/services/wallet";

export async function GET(req: NextRequest) {
  const user = await getUserFromRequest(req);
  if (!user) {
    return NextResponse.json({ error: "Sign in required" }, { status: 401 });
  }

  const [balanceResult, transactionsResult] = await Promise.all([
    walletService.getBalance(user.id),
    walletService.listTransactions(user.id),
  ]);

  if (balanceResult.error) {
    return NextResponse.json({ error: balanceResult.error }, { status: 500 });
  }
  if (transactionsResult.error) {
    return NextResponse.json({ error: transactionsResult.error }, { status: 500 });
  }

  return NextResponse.json({
    balance: balanceResult.data ?? 0,
    transactions: transactionsResult.data ?? [],
  });
}
