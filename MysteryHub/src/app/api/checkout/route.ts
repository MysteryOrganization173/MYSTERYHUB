/**
 * POST /api/checkout — Mystery Hub V1 Phase 3 (Payment Initialization).
 *
 * Thin HTTP wrapper around `checkoutService.startCheckout`. Runs the
 * "order created -> payment initialized" sequence server-side (it must —
 * both `ordersService` and `paymentService` require server-only secrets)
 * and returns everything `BuyFlow.tsx` needs to open the Paystack popup or
 * fall back to a redirect.
 *
 * Response shape matches `src/services/api.ts`'s `apiClient` convention:
 * on success, the JSON body IS the `CheckoutResult` (not wrapped in
 * `{ data, error }` — `apiClient` does that wrapping itself based on HTTP
 * status); on failure, the body is `{ error: string }` with a non-2xx
 * status, which `apiClient` reads via `json?.error`.
 *
 * Validation here is intentionally minimal (presence/type checks only) —
 * the source of truth for bundle pricing/availability is `catalogueService`
 * on the client before this is ever called; this route trusts the amount
 * it's given rather than re-deriving it, since the catalogue is mock-backed
 * today. Revisit once SuccessBizHub is live (server-side re-pricing).
 */
import { NextRequest, NextResponse } from "next/server";
import { checkoutService } from "@/services/checkout";
import { synthesizeGuestEmail } from "@/services/payments/guestEmail";
import type { CheckoutRequestBody } from "@/types/payment";

export async function POST(req: NextRequest) {
  let body: CheckoutRequestBody;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const { network, bundleId, bundleName, recipientPhone, amount, email } = body ?? {};

  if (
    typeof network !== "string" ||
    typeof bundleId !== "string" ||
    typeof bundleName !== "string" ||
    typeof recipientPhone !== "string" ||
    typeof amount !== "number" ||
    !Number.isFinite(amount) ||
    amount <= 0
  ) {
    return NextResponse.json(
      { error: "Missing or invalid checkout fields" },
      { status: 400 }
    );
  }

  const customerEmail =
    typeof email === "string" && email.trim().length > 0
      ? email.trim()
      : synthesizeGuestEmail(recipientPhone);

  const result = await checkoutService.startCheckout({
    network,
    bundleId,
    bundleName,
    recipientPhone,
    amount,
    email: customerEmail,
  });

  if (result.error || !result.data) {
    return NextResponse.json(
      { error: result.error ?? "Checkout failed" },
      { status: 502 }
    );
  }

  return NextResponse.json(result.data);
}
