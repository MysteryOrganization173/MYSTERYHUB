/**
 * Checkout Service — Mystery Hub V1 Phase 3 (Payment Initialization).
 *
 * Server-only orchestration of the flow requested for this phase:
 *
 *   customer presses Continue
 *     -> order created                 (ordersService.createOrder)
 *     -> payment initialized           (paymentService.initializePayment)
 *     -> [caller opens Paystack popup or redirect]
 *     -> pending payment status        (order already defaults to "pending")
 *     -> reference returned            (CheckoutResult.reference)
 *
 * Explicitly OUT of scope here (per Phase 3 directive):
 *   - Fulfillment of any kind (no `fulfillment_status` change, no
 *     SuccessBizHub call) — that remains a later phase.
 *   - Moving `payment_status` to "paid"/"failed" — that happens later, out
 *     of band, via the Paystack webhook (see
 *     src/app/api/payments/webhook/route.ts), not this service.
 *
 * Caller: src/app/api/checkout/route.ts. This service exists independently
 * of that route so the same orchestration could later be reused by a
 * Server Action or another entry point without duplicating logic.
 */
import { ordersService, generateOrderReference } from "@/services/orders";
import { paymentService } from "@/services/payments/paymentService";
import type { ApiResponse } from "@/types";
import type { CheckoutResult, StartCheckoutInput } from "@/types/payment";

export const checkoutService = {
  async startCheckout(
    input: StartCheckoutInput
  ): Promise<ApiResponse<CheckoutResult>> {
    const reference = generateOrderReference();

    const orderResult = await ordersService.createOrder({
      reference,
      userId: input.userId ?? null,
      network: input.network,
      bundleId: input.bundleId,
      bundleName: input.bundleName,
      recipientPhone: input.recipientPhone,
      amount: input.amount,
      currency: "GHS",
    });

    if (orderResult.error || !orderResult.data) {
      return {
        data: null,
        error: orderResult.error ?? "Failed to create order",
      };
    }

    const paymentResult = await paymentService.initializePayment({
      reference,
      amount: input.amount,
      currency: "GHS",
      email: input.email,
      metadata: {
        orderId: orderResult.data.id,
        network: input.network,
        bundleId: input.bundleId,
      },
    });

    if (paymentResult.error || !paymentResult.data) {
      // The order exists but payment never started — mark it "failed"
      // rather than leaving it ambiguously "pending" forever. Fulfillment
      // status is untouched; this is a payment-only outcome.
      await ordersService.updatePaymentStatus(reference, "failed");
      return {
        data: null,
        error: paymentResult.error ?? "Failed to initialize payment",
      };
    }

    return {
      data: {
        orderId: orderResult.data.id,
        reference: paymentResult.data.reference,
        authorizationUrl: paymentResult.data.authorizationUrl,
        accessCode: paymentResult.data.accessCode,
      },
      error: null,
    };
  },
};
