/**
 * POST /api/payments/webhook — Paystack webhook receiver.
 *
 * Verifies the `x-paystack-signature` header against the raw request body,
 * then — for `charge.success` / `charge.failed` only — updates the
 * matching order's `payment_status` via `ordersService.updatePaymentStatus`.
 *
 * V1.5 update: on `charge.success`, once `payment_status` is "paid", this
 * route now also (in this order):
 *   1. `fulfillmentService.processOrder()` — attempts real fulfillment via
 *      the currently-active supplier (see `supplierRegistry.ts`).
 *   2. `referralsService.creditCommission()` — credits the buyer's
 *      referrer's wallet, if any. Idempotent by construction (unique
 *      constraint on `referral_commissions.order_reference`), so a
 *      duplicate webhook delivery for the same event never double-credits.
 *
 * Both steps run best-effort: neither one's failure changes the HTTP
 * response Paystack sees (still 200 once the signature is valid, matching
 * Paystack's own retry semantics) — a fulfillment or commission failure
 * is logged, not swallowed silently, and remains visible via
 * `orders.fulfillment_error` / the admin panel.
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
import { fulfillmentService } from "@/services/fulfillment";
import { referralsService } from "@/services/referrals";
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
      const paymentStatus = mapPaystackChargeStatus(status);
      const updateResult = await ordersService.updatePaymentStatus(
        reference,
        paymentStatus,
        String(id)
      );

      const order = updateResult.data;
      if (paymentStatus === "paid" && order) {
        // Best-effort — logged, never allowed to change this route's
        // response to Paystack.
        await fulfillmentService
          .processOrder({
            orderReference: order.reference,
            network: order.network,
            bundleId: order.bundleId,
            bundleName: order.bundleName,
            recipientPhone: order.recipientPhone,
            amount: order.amount,
            currency: order.currency,
          })
          .catch((err) => {
            console.error(
              `[MysteryHub] Fulfillment failed for ${order.reference}:`,
              err
            );
          });

        await referralsService.creditCommission(order).then(({ error }) => {
          if (error) {
            console.error(
              `[MysteryHub] Referral commission crediting failed for ${order.reference}: ${error}`
            );
          }
        });
      }
    }
  }
  // Any other event type is acknowledged and ignored — no order update.

  // Always 200 once the signature is valid, so Paystack doesn't retry
  // indefinitely for event types we don't act on.
  return NextResponse.json({ received: true });
}
