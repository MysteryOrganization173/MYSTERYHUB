/**
 * Fulfillment Service — prepared, unwired (see docs/fulfillment.md).
 *
 * The orchestrator for the pipeline stage that comes after payment:
 *
 *   Order Service (payment_status = "paid")
 *     -> fulfillmentService.processOrder()
 *          -> idempotency check (attempts store, keyed by orderReference)
 *          -> SupplierAdapter.fulfill()
 *          -> ordersService.updateFulfillmentStatus()
 *          -> retryStrategy decides whether to re-enqueue on failure
 *
 * NOT called from any route, cron, or the payment webhook today —
 * `src/app/api/payments/webhook/route.ts` still only updates
 * `payment_status`, exactly as documented in docs/payment-flow.md. This
 * file exists so the next phase (per docs/ROADMAP.md sequencing) can wire
 * a caller without redesigning the orchestration.
 *
 * Server-only: transitively imports `ordersService`, which imports the
 * Supabase service-role admin client.
 */
import { ordersService } from "@/services/orders";
import type {
  FulfillmentAttemptRecord,
  FulfillmentJob,
  FulfillmentOutcome,
} from "@/types/fulfillment";
import {
  DEFAULT_MAX_FULFILLMENT_ATTEMPTS,
  nextRetryDelayMs,
  shouldRetry,
} from "./retryStrategy";
import { inMemoryFulfillmentQueue } from "./queue";
import { mockSupplierAdapter } from "./mockSupplierAdapter";
import type { SupplierAdapter } from "./supplierAdapter";

// ─── Single swap point for SuccessBizHub ──────────────────────────────────
// Same pattern as src/services/catalogue/catalogueService.ts: when the real
// SuccessBizHub adapter exists, implement `SupplierAdapter` in a new
// `successBizHubSupplierAdapter.ts` and change only the line below.
const adapter: SupplierAdapter = mockSupplierAdapter;

// ─── Idempotency / duplicate-protection store ─────────────────────────────
// In-memory today (lost on restart), keyed by `orderReference` — the same
// role `supabase/migrations/0002_fulfillment_attempts.sql` (prepared, not
// yet applied) plays for a real deployment. Swap this for a
// Supabase-backed read/write once that migration is applied; the function
// signatures below (`getAttempt`/`recordAttempt`) are written so that swap
// only touches this file, not `processOrder`'s call sites.
const attempts = new Map<string, FulfillmentAttemptRecord>();

function getAttempt(orderReference: string): FulfillmentAttemptRecord | null {
  return attempts.get(orderReference) ?? null;
}

function recordAttempt(record: FulfillmentAttemptRecord): void {
  attempts.set(record.orderReference, record);
}

function nowIso(): string {
  return new Date().toISOString();
}

export const fulfillmentService = {
  /**
   * Processes one fulfillment job to completion (one supplier call), or
   * short-circuits if the order was already delivered — this is the
   * duplicate-protection guarantee: calling `processOrder` twice for the
   * same `orderReference` never calls the supplier twice once it has
   * succeeded.
   */
  async processOrder(job: FulfillmentJob): Promise<FulfillmentOutcome> {
    const existing = getAttempt(job.orderReference);

    if (existing?.status === "delivered") {
      return {
        orderReference: job.orderReference,
        fulfillmentStatus: "delivered",
        supplierReference: existing.supplierReference,
        attemptNumber: existing.attemptNumber,
        shouldRetry: false,
      };
    }

    const attemptNumber = (existing?.attemptNumber ?? 0) + 1;

    const result = await adapter.fulfill(job);

    if (result.status === "rejected") {
      const willRetry = shouldRetry(attemptNumber);
      recordAttempt({
        id: `${job.orderReference}-${attemptNumber}`,
        orderReference: job.orderReference,
        attemptNumber,
        status: "failed",
        supplierReference: result.supplierReference,
        lastError: result.error ?? "Supplier rejected the order",
        createdAt: existing?.createdAt ?? nowIso(),
        updatedAt: nowIso(),
      });

      if (!willRetry) {
        await ordersService.updateFulfillmentStatus(job.orderReference, "failed");
      }

      return {
        orderReference: job.orderReference,
        fulfillmentStatus: willRetry ? "pending" : "failed",
        supplierReference: result.supplierReference,
        attemptNumber,
        shouldRetry: willRetry,
        error: result.error,
      };
    }

    recordAttempt({
      id: `${job.orderReference}-${attemptNumber}`,
      orderReference: job.orderReference,
      attemptNumber,
      status: "delivered",
      supplierReference: result.supplierReference,
      lastError: null,
      createdAt: existing?.createdAt ?? nowIso(),
      updatedAt: nowIso(),
    });

    await ordersService.updateFulfillmentStatus(job.orderReference, "delivered");

    return {
      orderReference: job.orderReference,
      fulfillmentStatus: "delivered",
      supplierReference: result.supplierReference,
      attemptNumber,
      shouldRetry: false,
    };
  },

  /**
   * Enqueues a job for later processing by a (future) worker loop, using
   * `retryStrategy.nextRetryDelayMs` to schedule the delay when
   * `attemptNumber` is a retry rather than the first attempt. No worker
   * loop exists yet — this only demonstrates the intended call shape
   * between `queue.ts` and `retryStrategy.ts`.
   */
  async enqueueRetry(job: FulfillmentJob, previousAttemptNumber: number): Promise<void> {
    await inMemoryFulfillmentQueue.enqueue(job, {
      delayMs: nextRetryDelayMs(previousAttemptNumber),
    });
  },

  /** Read-only inspection helper for tests/manual verification — not part
   * of the pipeline's control flow. */
  getAttemptCount(orderReference: string): number {
    return getAttempt(orderReference)?.attemptNumber ?? 0;
  },

  maxAttempts: DEFAULT_MAX_FULFILLMENT_ATTEMPTS,
};
