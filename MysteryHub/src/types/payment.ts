/**
 * Payment domain types — Mystery Hub V1 Phase 3 (Payment Initialization).
 *
 * Provider: Paystack. Scope: initialize a payment for an already-created
 * order and track it to a "pending" status with a reference — NOT order
 * fulfillment, NOT a SuccessBizHub call. See docs/payment-flow.md.
 *
 * Layout:
 *   - Our own request/result shapes (`StartCheckoutInput`, `CheckoutResult`,
 *     `PaymentInitInput`, `PaymentInitResult`) — safe to import from both
 *     server (services/checkout.ts, services/payments/*) and client
 *     (BuyFlow.tsx) code, since this file has no runtime dependencies.
 *   - Paystack's wire shapes (`Paystack*`) — only `paystackClient.ts` and
 *     the webhook route should touch these directly.
 *   - Webhook event models — prepared for the async payment-status sync;
 *     intentionally NOT used to trigger fulfillment or SuccessBizHub calls.
 */
import type { OrderPaymentStatus } from "./order";

export type PaymentProvider = "paystack";

// ─── Checkout orchestration (order creation + payment init) ──────────────

/** Body the client sends to POST /api/checkout. */
export interface CheckoutRequestBody {
  network: string;
  bundleId: string;
  bundleName: string;
  recipientPhone: string;
  /** Amount in the major currency unit (e.g. 9.99 GHS). */
  amount: number;
  /** Optional — the buy flow does not collect an email today, so the
   * checkout route synthesizes a placeholder when omitted. See
   * `synthesizeGuestEmail` and docs/payment-flow.md → "Known limitation". */
  email?: string;
}

/** Input to `checkoutService.startCheckout` — same as `CheckoutRequestBody`
 * but with `email` resolved (never optional) and an optional known user. */
export interface StartCheckoutInput {
  network: string;
  bundleId: string;
  bundleName: string;
  recipientPhone: string;
  amount: number;
  email: string;
  userId?: string | null;
}

/** Result returned by POST /api/checkout — everything the client needs to
 * open the Paystack popup (or redirect) and later show the pending state. */
export interface CheckoutResult {
  orderId: string;
  reference: string;
  authorizationUrl: string;
  accessCode: string;
}

// ─── Payment initialization (Paystack-specific orchestration) ────────────

/** Input for initializing a payment against an already-created order. */
export interface PaymentInitInput {
  /** Our own order reference — passed through as Paystack's `reference` so
   * both systems share one identifier; no separate payment-reference
   * lookup is needed. */
  reference: string;
  /** Amount in the major currency unit (e.g. 9.99 GHS) — converted to the
   * minor unit (pesewas) inside `paymentService`, never by callers. */
  amount: number;
  currency: "GHS";
  /** Paystack requires an email to initialize a transaction. */
  email: string;
  /** Arbitrary metadata echoed back on verify/webhook. */
  metadata?: Record<string, unknown>;
}

export interface PaymentInitResult {
  reference: string;
  authorizationUrl: string;
  accessCode: string;
}

/** Result of verifying a transaction directly against Paystack (not the
 * webhook path). Prepared for a future "confirm on return" flow; not
 * currently called by any route. */
export interface PaymentVerification {
  reference: string;
  status: OrderPaymentStatus;
  amountMinorUnits: number;
  currency: string;
  paidAt: string | null;
}

// ─── Paystack wire shapes ──────────────────────────────────────────────────
// Only `paystackClient.ts` and the webhook route should import these.

export interface PaystackInitializeRequestBody {
  email: string;
  /** Minor currency unit — pesewas for GHS. */
  amount: number;
  currency: "GHS";
  reference: string;
  callback_url?: string;
  metadata?: Record<string, unknown>;
}

export interface PaystackInitializeData {
  authorization_url: string;
  access_code: string;
  reference: string;
}

export interface PaystackApiResponse<T> {
  status: boolean;
  message: string;
  data: T;
}

export type PaystackInitializeResponse = PaystackApiResponse<PaystackInitializeData>;

export interface PaystackVerifyData {
  id: number;
  status: "success" | "failed" | "abandoned" | string;
  reference: string;
  amount: number;
  currency: string;
  paid_at: string | null;
  channel: string;
  customer: { email: string };
}

export type PaystackVerifyResponse = PaystackApiResponse<PaystackVerifyData>;

// ─── Webhook models (prepared, NOT wired to fulfillment) ──────────────────
//
// Paystack signs webhook payloads with an HMAC SHA512 of the raw body using
// the same secret key used for API calls (no separate webhook secret,
// unlike Stripe). See `src/services/payments/webhookVerifier.ts`.

export const PAYSTACK_EVENTS = {
  chargeSuccess: "charge.success",
  chargeFailed: "charge.failed",
} as const;

export type PaystackWebhookEventName =
  | typeof PAYSTACK_EVENTS.chargeSuccess
  | typeof PAYSTACK_EVENTS.chargeFailed
  | string;

export interface PaystackChargeEventData {
  id: number;
  status: "success" | "failed" | string;
  /** Matches our own order `reference` — see `PaymentInitInput.reference`. */
  reference: string;
  amount: number;
  currency: string;
  paid_at: string | null;
  customer: { email: string };
  metadata?: Record<string, unknown> | null;
}

export interface PaystackWebhookEvent<T = unknown> {
  event: PaystackWebhookEventName;
  data: T;
}

export type PaystackChargeWebhookEvent = PaystackWebhookEvent<PaystackChargeEventData>;

/** Maps a Paystack charge status to our own `OrderPaymentStatus`. Anything
 * that isn't explicitly `"success"` maps to `"failed"` — this function must
 * never default an unrecognized status to `"paid"`. */
export function mapPaystackChargeStatus(status: string): OrderPaymentStatus {
  return status === "success" ? "paid" : "failed";
}
