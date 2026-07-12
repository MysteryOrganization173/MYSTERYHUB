# Mystery Hub — Fulfillment Pipeline (Prepared, Not Wired)

> Status: **Types, interfaces, and an in-memory reference implementation
> exist. Nothing described here is called by any route, cron, or the
> payment webhook.** SuccessBizHub is NOT connected — that remains a
> separate, later change.
> Related: [`ARCHITECTURE.md`](./ARCHITECTURE.md), [`ROADMAP.md`](./ROADMAP.md),
> [`payment-flow.md`](./payment-flow.md), [`catalogue.md`](./catalogue.md),
> [`v1-implementation-plan.md`](./v1-implementation-plan.md).

---

## Why this exists

`payment-flow.md` ends at `payment_status = "paid"` and explicitly stops
there: *"Fulfillment trigger on `payment_status = 'paid'` — deliberately
not built."* Per `ROADMAP.md`'s V1 sequencing, the next step after payment
is *"SuccessBizHub fulfill/status + `/track`"*. This document designs that
next step's **shape** — a modular, idempotent, retry-ready pipeline — and
the code in `src/services/fulfillment/` implements that shape against a
mock supplier, so the eventual SuccessBizHub integration is a small,
isolated change (the same pattern `src/services/catalogue/` already
established for the catalog read path — see `catalogue.md`).

Nothing here changes `checkoutService`, the payment webhook, `ordersService`,
or any component. This is additive, unused scaffolding.

## Target architecture

```
Customer
   │  pays via Paystack popup/redirect (see payment-flow.md)
   ▼
Checkout  (src/services/checkout.ts — unchanged)
   ▼
Payment Service  (src/services/payments/paymentService.ts — unchanged)
   ▼
Webhook  (src/app/api/payments/webhook/route.ts — unchanged, still only
   │       updates payment_status)
   ▼
Order Service  (src/services/orders.ts — unchanged)
   │  a future caller (not built) reads payment_status = "paid",
   │  fulfillment_status = "pending" orders and builds a FulfillmentJob
   ▼
Fulfillment Service  (src/services/fulfillment/fulfillmentService.ts — NEW, unwired)
   │  idempotency check → calls the active SupplierAdapter → updates
   │  fulfillment_status → decides retry via retryStrategy
   ▼
Supplier Adapter  (src/services/fulfillment/supplierAdapter.ts — NEW, interface only)
   │  mockSupplierAdapter today; successBizHubSupplierAdapter later
   ▼
SuccessBizHub  ← NOT CONNECTED. No file in this codebase calls it.
   ▼
Order Tracking  (/track — not built yet, separate phase per ROADMAP.md;
                 will read OrderRecord.fulfillmentStatus, already exposed
                 by ordersService.getOrderByReference)
```

## What was built this phase

| File | Role |
|---|---|
| `src/types/fulfillment.ts` | `FulfillmentJob`, `SupplierFulfillmentResult`, `SupplierStatusResult`, `FulfillmentAttemptRecord`, `FulfillmentOutcome` |
| `src/services/fulfillment/supplierAdapter.ts` | `SupplierAdapter` interface — `fulfill(job)` / `checkStatus(supplierReference)` |
| `src/services/fulfillment/mockSupplierAdapter.ts` | The only `SupplierAdapter` implementation today (mirrors `mockCatalogueSource.ts`) |
| `src/services/fulfillment/retryStrategy.ts` | Pure functions: `shouldRetry()`, `nextRetryDelayMs()` |
| `src/services/fulfillment/queue.ts` | `FulfillmentQueue` interface + `inMemoryFulfillmentQueue` implementation |
| `src/services/fulfillment/fulfillmentService.ts` | Orchestrator: `processOrder()`, `enqueueRetry()` |
| `src/services/fulfillment/index.ts` | Barrel export |
| `supabase/migrations/0002_fulfillment_attempts.sql` | **Prepared, not applied** — durable idempotency ledger |

`src/services/index.ts` exports `fulfillmentService`, annotated the same
way `checkoutService` is (server-only, do not import from a `"use client"`
component).

## Idempotency

Every job carries `orderReference` (the same public reference already used
across `ordersService`/Paystack) as its sole idempotency key. Two layers
enforce "never fulfil the same order twice":

1. **Before calling the supplier**: `fulfillmentService.processOrder()`
   looks up the existing attempt record for that `orderReference`. If its
   status is already `"delivered"`, the function returns immediately
   without calling `SupplierAdapter.fulfill()` again.
2. **After calling the supplier**: every attempt (success or failure) is
   recorded with an incrementing `attemptNumber`, so even a crash between
   "supplier accepted" and "order updated" leaves a clear, countable trail
   rather than a silent duplicate.

Today the attempt record lives in an in-memory `Map` inside
`fulfillmentService.ts` — adequate for a not-yet-wired pipeline, but it
does not survive a process restart. `supabase/migrations/0002_fulfillment_attempts.sql`
is the prepared, **not-yet-applied** durable replacement: once applied and
wired in, only the `getAttempt`/`recordAttempt` helpers inside
`fulfillmentService.ts` change (a Supabase read/write instead of a `Map`
read/write) — `processOrder()`'s control flow does not.

## Retry strategy

`retryStrategy.ts` is deliberately pure (no timers, no I/O):

- `shouldRetry(attemptNumber, maxAttempts = 5)` — `true` while under the
  cap.
- `nextRetryDelayMs(attemptNumber)` — exponential backoff (2s, 4s, 8s, …),
  capped at 5 minutes.

`fulfillmentService.processOrder()` uses `shouldRetry` to decide whether a
rejected job's outcome is `fulfillment_status = "pending"` (still eligible
for another attempt) or `"failed"` (attempts exhausted — a human/support
follow-up per `docs/ROADMAP.md`'s `/support` path is the intended next
step, not built here). `enqueueRetry()` shows how a future caller would
combine `nextRetryDelayMs()` with the queue, but nothing calls
`enqueueRetry()` today.

## Queue abstraction

`queue.ts` defines `FulfillmentQueue` (`enqueue`/`dequeue`/`size`) and one
implementation, `inMemoryFulfillmentQueue`. No queue *technology* (Redis,
BullMQ, SQS, Postgres-backed) was chosen or installed — per the "don't
introduce unnecessary dependencies" directive, that decision is deferred
until a real worker/cron process needs one. The interface exists now so
that decision, whenever made, doesn't require touching
`fulfillmentService.ts` — only a new file implementing `FulfillmentQueue`.

## Supplier abstraction

`SupplierAdapter` is intentionally narrow — `fulfill(job)` and
`checkStatus(supplierReference)` — mirroring `CatalogueSource`'s two-method
shape in `src/services/catalogue/types.ts`. `mockSupplierAdapter.ts` is the
only implementation today; it always accepts and reports `"delivered"`
after a short simulated delay, with no network call. When SuccessBizHub is
ready:

1. Add `src/services/fulfillment/successBizHubSupplierAdapter.ts`
   implementing `SupplierAdapter`, calling SuccessBizHub's real
   fulfillment endpoints via `apiClient`.
2. In `fulfillmentService.ts`, change one line:
   ```ts
   const adapter: SupplierAdapter = successBizHubSupplierAdapter; // was mockSupplierAdapter
   ```
3. Apply `supabase/migrations/0002_fulfillment_attempts.sql` and swap the
   in-memory `Map` for real reads/writes against that table.
4. Wire a real caller — e.g. the payment webhook route (after it sets
   `payment_status = "paid"`) or a polling cron route that queries
   `payment_status = "paid" AND fulfillment_status = "pending"` orders.
   **Not decided or built here** — a deliberate, separate change per
   `ROADMAP.md`'s phased sequencing.

No changes required to `ordersService`, `checkoutService`, `paymentService`,
`paystackClient`, `webhookVerifier`, or any component.

## Fulfillment models

See `src/types/fulfillment.ts` for the full definitions. Summary:

| Type | Purpose |
|---|---|
| `FulfillmentJob` | Unit of work handed to a `SupplierAdapter` |
| `SupplierFulfillmentResult` | Adapter's response to `fulfill()` — `"accepted" \| "rejected"` + optional `supplierReference` |
| `SupplierStatusResult` | Adapter's response to `checkStatus()` — `"processing" \| "delivered" \| "failed"` |
| `FulfillmentAttemptRecord` | One row of the (prepared) `fulfillment_attempts` table |
| `FulfillmentOutcome` | What `fulfillmentService.processOrder()` returns — includes `shouldRetry` |

## What this change explicitly does NOT do

- Does **not** call SuccessBizHub or any real supplier API.
- Does **not** modify `checkoutService`, `paymentService`, `paystackClient`,
  `webhookVerifier`, or the payment webhook route — `fulfillment_status` is
  still only ever touched by `ordersService.updateFulfillmentStatus()`,
  and nothing new calls that method yet outside of `fulfillmentService`
  itself, which nothing calls.
- Does **not** apply `supabase/migrations/0002_fulfillment_attempts.sql` —
  it is reviewed and ready, not run.
- Does **not** add a new dependency (no queue/job library).
- Does **not** build `/track`, an admin fulfillment view, or a cron/worker
  entry point that would actually invoke `fulfillmentService.processOrder()`
  — those remain separate, later changes per `ROADMAP.md`.
