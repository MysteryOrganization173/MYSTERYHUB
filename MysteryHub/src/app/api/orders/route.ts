/**
 * GET /api/orders — the signed-in user's own order history.
 *
 * Distinct from `/api/orders/[reference]` (single, guest-accessible
 * lookup by exact reference — see that route's doc comment). This route
 * requires a signed-in user and returns every order linked to their
 * account, newest first. Powers the dashboard's recent-orders list and
 * `/dashboard/orders`.
 */
import { NextRequest, NextResponse } from "next/server";
import { getUserFromRequest } from "@/lib/supabase/serverAuth";
import { ordersService } from "@/services/orders";

export async function GET(req: NextRequest) {
  const user = await getUserFromRequest(req);
  if (!user) {
    return NextResponse.json({ error: "Sign in required" }, { status: 401 });
  }

  const result = await ordersService.getOrdersForUser(user.id);
  if (result.error) {
    return NextResponse.json({ error: result.error }, { status: 500 });
  }
  return NextResponse.json(result.data ?? []);
}
