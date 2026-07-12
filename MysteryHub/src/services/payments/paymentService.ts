/**
 * Payment Service — Mystery Hub V1 Phase 3 (Payment Initialization).
 *
 * Server-only orchestration around `paystackClient`: converts our domain
 * shapes (major-unit GHS amounts) to Paystack's wire shapes (minor-unit
 * pesewas) and back. `checkoutService` (src/services/checkout.ts) is the
 * only caller today. Never throws — returns `ApiResponse<T>`, matching
 * every other service in this codebase.
 */
import type { ApiResponse } from "@/types";
import type {
  PaymentInitInput,
  PaymentInitResult,
  PaymentVerification,
} from "@/types/payment";
import { mapPaystackChargeStatus } from "@/types/payment";
import { paystackClient } from "./paystackClient";

/** Converts a major-unit GHS amount (e.g. 9.99) to Paystack's minor unit
 * (pesewas, e.g. 999). Rounded to avoid floating-point drift. */
function toMinorUnits(amount: number): number {
  return Math.round(amount * 100);
}

function toMajorUnits(amountMinorUnits: number): number {
  return amountMinorUnits / 100;
}

export const paymentService = {
  /** Initializes a Paystack transaction for an already-created order.
   * Passes our own order `reference` through to Paystack so both systems
   * share one identifier — no separate payment-reference lookup needed. */
  async initializePayment(
    input: PaymentInitInput
  ): Promise<ApiResponse<PaymentInitResult>> {
    const { data, error } = await paystackClient.initializeTransaction({
      email: input.email,
      amount: toMinorUnits(input.amount),
      currency: input.currency,
      reference: input.reference,
      metadata: input.metadata,
    });

    if (error || !data) {
      return { data: null, error: error ?? "Failed to initialize payment" };
    }

    return {
      data: {
        reference: data.data.reference,
        authorizationUrl: data.data.authorization_url,
        accessCode: data.data.access_code,
      },
      error: null,
    };
  },

  /** Verifies a transaction directly against Paystack. Not called by any
   * route today (the webhook is the primary status-sync path) — prepared
   * for a future "confirm on return from Paystack" UX. */
  async verifyPayment(
    reference: string
  ): Promise<ApiResponse<PaymentVerification>> {
    const { data, error } = await paystackClient.verifyTransaction(reference);

    if (error || !data) {
      return { data: null, error: error ?? "Failed to verify payment" };
    }

    return {
      data: {
        reference: data.data.reference,
        status: mapPaystackChargeStatus(data.data.status),
        amountMinorUnits: data.data.amount,
        currency: data.data.currency,
        paidAt: data.data.paid_at,
      },
      error: null,
    };
  },
};

export { toMajorUnits };
