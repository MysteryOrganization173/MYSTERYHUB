/**
 * GET/PATCH /api/admin/withdrawals — the payout approval queue.
 * Admin-only. See src/services/withdrawals.ts.
 */
import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/supabase/serverAuth";
import { withdrawalsService } from "@/services/withdrawals";
import type { WithdrawalStatus } from "@/types/withdrawal";

export async function GET(req: NextRequest) {
  const admin = await requireAdmin(req);
  if (!admin) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const result = await withdrawalsService.listAll();
  if (result.error) {
    return NextResponse.json({ error: result.error }, { status: 500 });
  }
  return NextResponse.json(result.data ?? []);
}

const VALID_STATUSES: WithdrawalStatus[] = ["approved", "paid", "rejected"];

export async function PATCH(req: NextRequest) {
  const admin = await requireAdmin(req);
  if (!admin) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  let body: { id?: string; status?: string; adminNote?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  if (typeof body?.id !== "string") {
    return NextResponse.json({ error: "id is required" }, { status: 400 });
  }
  if (!VALID_STATUSES.includes(body.status as WithdrawalStatus)) {
    return NextResponse.json(
      { error: `status must be one of: ${VALID_STATUSES.join(", ")}` },
      { status: 400 }
    );
  }

  const result = await withdrawalsService.setStatus(
    body.id,
    body.status as WithdrawalStatus,
    body.adminNote
  );

  if (result.error || !result.data) {
    return NextResponse.json({ error: result.error ?? "Update failed" }, { status: 400 });
  }
  return NextResponse.json(result.data);
}
