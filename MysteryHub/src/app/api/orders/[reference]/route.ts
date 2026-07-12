/**
 * GET /api/orders/[reference] — Mystery Hub V1 Phase 4 (Order Tracking).
 *
 * Thin HTTP wrapper around `ordersService.getOrderByReference`. Server-only
 * (the service imports the Supabase service-role admin client) — this route
 * is the only way a browser can read a guest order, matching the RLS design
 * documented in `supabase/migrations/0001_init_profiles_and_orders.sql`
 * ("guest orders ... must be read via a server-side route using the
 * service role key, matched by exact reference, never a broad client
 * query"). Uses the `API.order(id)` constant already defined in
 * `src/constants/index.ts`.
 *
 * Response shape matches `/api/checkout`'s convention (see
 * `src/app/api/checkout/route.ts`): on success the JSON body IS the
 * `OrderRecord` (status 200); on failure the body is `{ error: string }`
 * with a non-2xx status — `apiClient` wraps either case into `{ data, error }`
 * on the client side.
 *
 * Does NOT call SuccessBizHub or trigger fulfillment — read-only against
 * the existing `orders` table. See docs/order-tracking.md.
 */
import { NextRequest, NextResponse } from "next/server";
import { ordersService } from "@/services/orders";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ reference: string }> }
) {
  const { reference: rawReference } = await params;
  const reference = rawReference?.trim();

  if (!reference) {
    return NextResponse.json(
      { error: "Missing order reference" },
      { status: 400 }
    );
  }

  const result = await ordersService.getOrderByReference(reference);

  if (result.error || !result.data) {
    const notFound = result.error === "Order not found";
    return NextResponse.json(
      { error: result.error ?? "Failed to look up order" },
      { status: notFound ? 404 : 500 }
    );
  }

  return NextResponse.json(result.data);
}
