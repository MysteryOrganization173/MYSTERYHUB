/**
 * Retry strategy — prepared, unwired.
 *
 * Pure functions only (no I/O, no timers started here) so
 * `fulfillmentService` — or a future queue worker — decides *when* to act
 * on the numbers this module returns. Exponential backoff with a cap,
 * matching the shape most job-queue libraries expose, without depending on
 * one. See docs/fulfillment.md → "Retry strategy".
 */

export const DEFAULT_MAX_FULFILLMENT_ATTEMPTS = 5;
const BASE_DELAY_MS = 2_000;
const MAX_DELAY_MS = 5 * 60 * 1_000; // 5 minutes

/** True while another attempt is still allowed. `attemptNumber` is
 * 1-indexed (the attempt that just ran), matching
 * `FulfillmentAttemptRecord.attemptNumber`. */
export function shouldRetry(
  attemptNumber: number,
  maxAttempts: number = DEFAULT_MAX_FULFILLMENT_ATTEMPTS
): boolean {
  return attemptNumber < maxAttempts;
}

/** Exponential backoff, doubling per attempt, capped at `MAX_DELAY_MS`.
 * `attemptNumber` is the attempt that just failed (1-indexed) — the delay
 * returned is how long to wait before attempt `attemptNumber + 1`. */
export function nextRetryDelayMs(attemptNumber: number): number {
  const delay = BASE_DELAY_MS * 2 ** (attemptNumber - 1);
  return Math.min(delay, MAX_DELAY_MS);
}
