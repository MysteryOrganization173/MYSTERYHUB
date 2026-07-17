/**
 * POST /api/checkout — Mystery Hub V1 Phase 3 (Payment Initialization),
 * extended in V1.5 to resolve the signed-in user (if any) and support the
 * "Pay with Wallet" method.
 *
 * Thin HTTP wrapper around `checkoutService.startCheckout`. Runs the
 * "order created -> payment initialized" sequence server-side (it must —
 * both `ordersService` and `paymentService` require server-only secrets)
 * and returns everything `BuyFlow.tsx` needs to open the Paystack popup or
 * fall back to a redirect (or, for a wallet payment, the already-final
 * result — see `src/types/payment.ts`'s `CheckoutResult`).
 *
 * Resolving the user is OPTIONAL for `paymentMethod: "paystack"` (guest
 * checkout stays supported, unchanged from V1) but REQUIRED for
 * `paymentMethod: "wallet"` — you can't debit a wallet you don't have an
 * account for. See `src/lib/supabase/serverAuth.ts` for why this reads an
 * `Authorization: Bearer <token>` header instead of a cookie.
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
import { getUserFromRequest } from "@/lib/supabase/serverAuth";
import type { CheckoutRequestBody } from "@/types/payment";

export async function POST(req: NextRequest) {
  let body: CheckoutRequestBody;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const { network, bundleId, bundleName, recipientPhone, amount, email, paymentMethod } =
    body ?? {};

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

  const user = await getUserFromRequest(req);

  if (paymentMethod === "wallet" && !user) {
    return NextResponse.json(
      { error: "You must be signed in to pay with your wallet." },
      { status: 401 }
    );
  }

  const customerEmail =
    typeof email === "string" && email.trim().length > 0
      ? email.trim()
      : user?.email ?? synthesizeGuestEmail(recipientPhone);

  const result = await checkoutService.startCheckout({
    network,
    bundleId,
    bundleName,
    recipientPhone,
    amount,
    email: customerEmail,
    userId: user?.id ?? null,
    paymentMethod,
  });

  if (result.error || !result.data) {
    return NextResponse.json(
      { error: result.error ?? "Checkout failed" },
      { status: 502 }
    );
  }

  return NextResponse.json(result.data);
}
