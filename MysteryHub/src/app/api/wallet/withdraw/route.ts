/**
 * GET/POST /api/wallet/withdraw — the signed-in user's withdrawal requests.
 *
 * GET lists the caller's own request history. POST creates a new request
 * (debits the wallet immediately — see `withdrawalsService`). Both require
 * a signed-in user.
 */
import { NextRequest, NextResponse } from "next/server";
import { getUserFromRequest } from "@/lib/supabase/serverAuth";
import { withdrawalsService } from "@/services/withdrawals";

export async function GET(req: NextRequest) {
  const user = await getUserFromRequest(req);
  if (!user) {
    return NextResponse.json({ error: "Sign in required" }, { status: 401 });
  }

  const result = await withdrawalsService.listForUser(user.id);
  if (result.error) {
    return NextResponse.json({ error: result.error }, { status: 500 });
  }
  return NextResponse.json(result.data);
}

export async function POST(req: NextRequest) {
  const user = await getUserFromRequest(req);
  if (!user) {
    return NextResponse.json({ error: "Sign in required" }, { status: 401 });
  }

  let body: { amount?: number; payoutNumber?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const { amount, payoutNumber } = body ?? {};
  if (typeof amount !== "number" || !Number.isFinite(amount) || amount <= 0) {
    return NextResponse.json({ error: "Invalid withdrawal amount" }, { status: 400 });
  }
  if (typeof payoutNumber !== "string" || payoutNumber.trim().length === 0) {
    return NextResponse.json({ error: "A mobile money number is required" }, { status: 400 });
  }

  const result = await withdrawalsService.createRequest(user.id, amount, payoutNumber);
  if (result.error || !result.data) {
    return NextResponse.json({ error: result.error ?? "Withdrawal request failed" }, { status: 400 });
  }
  return NextResponse.json(result.data);
}
