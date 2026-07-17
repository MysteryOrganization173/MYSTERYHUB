/**
 * Checkout Service — Mystery Hub V1 Phase 3 (Payment Initialization),
 * extended in V1.5 with a full-balance "Pay with Wallet" path.
 *
 * Two flows, chosen by `input.paymentMethod` (defaults to `"paystack"`):
 *
 *   Paystack (unchanged from V1):
 *     customer presses Continue
 *       -> order created                 (ordersService.createOrder)
 *       -> payment initialized           (paymentService.initializePayment)
 *       -> [caller opens Paystack popup or redirect]
 *       -> pending payment status        (order already defaults to "pending")
 *       -> reference returned            (CheckoutResult.reference)
 *     `payment_status` only ever moves to "paid"/"failed" later, out of
 *     band, via the Paystack webhook (`src/app/api/payments/webhook/route.ts`).
 *
 *   Wallet (V1.5 addition — full balance only, no partial split):
 *     customer presses "Pay with Wallet"
 *       -> order created
 *       -> walletService.debit()         (fails closed on insufficient balance)
 *       -> ordersService.updatePaymentStatus(..., "paid")
 *       -> fulfillmentService.processOrder()   (synchronous — no webhook to wait for)
 *       -> referralsService.creditCommission() (best-effort, same as the webhook path)
 *     If the debit fails, the order is marked "failed" (mirrors the
 *     existing Paystack-init-failure branch below) and the wallet is
 *     never touched.
 *
 * Caller: src/app/api/checkout/route.ts.
 */
import { ordersService, generateOrderReference } from "@/services/orders";
import { paymentService } from "@/services/payments/paymentService";
import { walletService } from "@/services/wallet";
import { fulfillmentService } from "@/services/fulfillment";
import { referralsService } from "@/services/referrals";
import type { ApiResponse } from "@/types";
import type { CheckoutResult, StartCheckoutInput } from "@/types/payment";

async function startWalletCheckout(
  input: StartCheckoutInput,
  reference: string,
  orderId: string
): Promise<ApiResponse<CheckoutResult>> {
  if (!input.userId) {
    return { data: null, error: "You must be signed in to pay with your wallet." };
  }

  const debitResult = await walletService.debit(
    input.userId,
    input.amount,
    `Order ${reference} — ${input.bundleName}`,
    reference
  );

  if (debitResult.error || !debitResult.data) {
    await ordersService.updatePaymentStatus(reference, "failed");
    return { data: null, error: debitResult.error ?? "Wallet payment failed" };
  }

  const paidOrder = await ordersService.updatePaymentStatus(
    reference,
    "paid",
    `wallet:${reference}`
  );

  if (paidOrder.data) {
    await fulfillmentService
      .processOrder({
        orderReference: paidOrder.data.reference,
        network: paidOrder.data.network,
        bundleId: paidOrder.data.bundleId,
        bundleName: paidOrder.data.bundleName,
        recipientPhone: paidOrder.data.recipientPhone,
        amount: paidOrder.data.amount,
        currency: paidOrder.data.currency,
      })
      .catch((err) => {
        console.error(`[MysteryHub] Fulfillment failed for ${reference}:`, err);
      });

    await referralsService.creditCommission(paidOrder.data).then(({ error }) => {
      if (error) {
        console.error(
          `[MysteryHub] Referral commission crediting failed for ${reference}: ${error}`
        );
      }
    });
  }

  return {
    data: {
      orderId,
      reference,
      method: "wallet",
      walletBalanceAfter: debitResult.data.balanceAfter,
    },
    error: null,
  };
}

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

    if (input.paymentMethod === "wallet") {
      return startWalletCheckout(input, reference, orderResult.data.id);
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
        method: "paystack",
        authorizationUrl: paymentResult.data.authorizationUrl,
        accessCode: paymentResult.data.accessCode,
      },
      error: null,
    };
  },
};
