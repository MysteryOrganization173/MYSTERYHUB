/**
 * Fulfillment domain types — prepared, unwired (V1 sequencing step after
 * payment; see docs/fulfillment.md).
 *
 * These types describe the pipeline stage that reads a `payment_status =
 * "paid"` order and drives it to `fulfillment_status = "delivered"` via a
 * `SupplierAdapter` (SuccessBizHub will be the first real implementation).
 * Nothing in this module is imported by any route or the payment webhook
 * yet — see docs/fulfillment.md → "What this does NOT do".
 */
import type { OrderFulfillmentStatus } from "./order";

/** Mirrors `OrderFulfillmentStatus` today, kept as a distinct alias so the
 * fulfillment pipeline's internal state machine can grow states (e.g.
 * `"queued"`, `"retrying"`) without widening the `orders` table's own
 * enum — only `fulfillmentService` translates between the two. */
export type { OrderFulfillmentStatus };

/** The unit of work handed to a `SupplierAdapter`. Deliberately narrow —
 * only what a supplier needs to fulfil one internet-package order. */
export interface FulfillmentJob {
  /** Same value as `OrderRecord.reference` — the single idempotency key
   * used across the whole fulfillment pipeline (queue, attempts table,
   * supplier adapter calls). */
  orderReference: string;
  network: string;
  bundleId: string;
  bundleName: string;
  recipientPhone: string;
  amount: number;
  currency: string;
}

/** What a `SupplierAdapter.fulfill()` call resolves to. `supplierReference`
 * is the supplier's own order id (e.g. SuccessBizHub's `order_id`), stored
 * so a later `checkStatus()` call or support lookup can reference it. */
export interface SupplierFulfillmentResult {
  status: "accepted" | "rejected";
  supplierReference: string | null;
  /** Present when `status === "rejected"` or the call itself failed. */
  error?: string;
}

/** What a `SupplierAdapter.checkStatus()` call resolves to — used for
 * suppliers that fulfil asynchronously (accept now, deliver later). */
export interface SupplierStatusResult {
  status: "processing" | "delivered" | "failed";
  error?: string;
}

/** One row of the (not-yet-applied) `fulfillment_attempts` table — see
 * supabase/migrations/0002_fulfillment_attempts.sql. Tracks every attempt
 * to fulfil a given order so retries are countable and duplicate
 * processing is detectable before calling a supplier. */
export interface FulfillmentAttemptRecord {
  id: string;
  orderReference: string;
  attemptNumber: number;
  status: "pending" | "processing" | "delivered" | "failed";
  supplierReference: string | null;
  lastError: string | null;
  createdAt: string;
  updatedAt: string;
}

/** Outcome of one `fulfillmentService.processOrder()` call — what the
 * (future) caller uses to decide whether to re-enqueue via
 * `retryStrategy`. */
export interface FulfillmentOutcome {
  orderReference: string;
  fulfillmentStatus: OrderFulfillmentStatus;
  supplierReference: string | null;
  attemptNumber: number;
  /** True when the caller should enqueue another attempt (a transient
   * failure under the retry limit) rather than surface a hard failure. */
  shouldRetry: boolean;
  error?: string;
}
