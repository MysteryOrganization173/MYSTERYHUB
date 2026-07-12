/**
 * POST /api/payments/webhook — Paystack webhook receiver.
 *
 * Verifies the `x-paystack-signature` header against the raw request body,
 * then — for `charge.success` / `charge.failed` only — updates the
 * matching order's `payment_status` via `ordersService.updatePaymentStatus`.
 *
 * Explicitly does NOT:
 *   - Update `fulfillment_status` (no fulfillment happens here)
 *   - Call SuccessBizHub in any way
 *   - Trust the webhook body before the signature is verified
 *
 * Must run on the Node.js runtime (not Edge) — signature verification uses
 * Node's `crypto` module (see `webhookVerifier.ts`).
 *
 * Configure this URL in the Paystack dashboard once a public URL exists;
 * nothing calls this route automatically in local development.
 */
import { NextRequest, NextResponse } from "next/server";
import { verifyPaystackSignature } from "@/services/payments/webhookVerifier";
import { ordersService } from "@/services/orders";
import {
  mapPaystackChargeStatus,
  PAYSTACK_EVENTS,
  type PaystackChargeWebhookEvent,
} from "@/types/payment";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  const rawBody = await req.text();
  const signature = req.headers.get("x-paystack-signature");

  if (!verifyPaystackSignature(rawBody, signature)) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  let event: PaystackChargeWebhookEvent;
  try {
    event = JSON.parse(rawBody);
  } catch {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  if (
    event.event === PAYSTACK_EVENTS.chargeSuccess ||
    event.event === PAYSTACK_EVENTS.chargeFailed
  ) {
    const { reference, status, id } = event.data;
    if (reference) {
      // payment_status only — fulfillment_status is intentionally untouched.
      await ordersService.updatePaymentStatus(
        reference,
        mapPaystackChargeStatus(status),
        String(id)
      );
    }
  }
  // Any other event type is acknowledged and ignored — no order update.

  // Always 200 once the signature is valid, so Paystack doesn't retry
  // indefinitely for event types we don't act on.
  return NextResponse.json({ received: true });
}
