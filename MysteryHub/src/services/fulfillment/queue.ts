/**
 * FulfillmentQueue — prepared, unwired.
 *
 * A minimal queue *abstraction* so `fulfillmentService` never talks to a
 * specific queue technology directly. Today only an in-memory
 * implementation exists (no new dependency — no BullMQ/Redis/SQS — per the
 * "don't introduce unnecessary dependencies" directive). A future
 * persistent implementation (e.g. a Postgres-backed queue table, or a
 * managed queue service) only needs to implement `FulfillmentQueue`;
 * nothing else in this folder changes. See docs/fulfillment.md → "Queue
 * abstraction".
 *
 * Not wired into any route, cron, or the payment webhook — nothing enqueues
 * onto `inMemoryFulfillmentQueue` today.
 */
import type { FulfillmentJob } from "@/types/fulfillment";

export interface EnqueueOptions {
  /** Delay before the job becomes available to `dequeue()`, in
   * milliseconds. Used by `fulfillmentService` for retry backoff
   * (`retryStrategy.nextRetryDelayMs`). Omitted/0 = available immediately. */
  delayMs?: number;
}

export interface FulfillmentQueue {
  enqueue(job: FulfillmentJob, options?: EnqueueOptions): Promise<void>;
  /** Removes and returns the next available job, or `null` if the queue is
   * empty (no blocking/long-polling — callers loop or are triggered
   * externally, e.g. a future cron route). */
  dequeue(): Promise<FulfillmentJob | null>;
  /** Number of jobs currently available (excludes delayed jobs not yet
   * due) — a debugging/observability aid, not part of the core contract. */
  size(): number;
}

interface DelayedEntry {
  job: FulfillmentJob;
  availableAt: number;
}

/** Single-process, in-memory implementation. Jobs are lost on restart —
 * acceptable for a not-yet-wired pipeline; swap for a persistent
 * `FulfillmentQueue` before this is ever enqueued to in production. */
class InMemoryFulfillmentQueue implements FulfillmentQueue {
  private entries: DelayedEntry[] = [];

  async enqueue(job: FulfillmentJob, options?: EnqueueOptions): Promise<void> {
    const availableAt = Date.now() + (options?.delayMs ?? 0);
    this.entries.push({ job, availableAt });
  }

  async dequeue(): Promise<FulfillmentJob | null> {
    const now = Date.now();
    const index = this.entries.findIndex((entry) => entry.availableAt <= now);
    if (index === -1) return null;
    const [entry] = this.entries.splice(index, 1);
    return entry.job;
  }

  size(): number {
    const now = Date.now();
    return this.entries.filter((entry) => entry.availableAt <= now).length;
  }
}

export const inMemoryFulfillmentQueue: FulfillmentQueue =
  new InMemoryFulfillmentQueue();
