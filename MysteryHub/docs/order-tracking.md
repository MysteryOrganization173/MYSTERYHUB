# Mystery Hub — Order Tracking (V1 Phase 4)

> Status: **Built and wired into `/track`.** Read-only against the existing
> `orders` table. SuccessBizHub is NOT connected — this phase only surfaces
> the two independent status columns `payment_status`/`fulfillment_status`
> already written by `checkoutService` and the Paystack webhook.
> Related: [`ARCHITECTURE.md`](./ARCHITECTURE.md), [`ROADMAP.md`](./ROADMAP.md),
> [`payment-flow.md`](./payment-flow.md), [`catalogue.md`](./catalogue.md),
> [`fulfillment.md`](./fulfillment.md).

---

## Scope

Completes the customer journey that `payment-flow.md` leaves open-ended:
after paying, a customer (guest or signed-in) can look up their order by
reference and see exactly where it stands. No new write path, no
SuccessBizHub call, no authenticated "my orders" list — guest lookup by
exact reference only, matching the RLS design already documented in
`supabase/migrations/0001_init_profiles_and_orders.sql`.

## Layer diagram

```
/track (src/app/track/page.tsx)
    │  PageContainer/PageHeader shell (unchanged), wraps:
    ▼
OrderLookupView  (src/components/track/OrderLookupView.tsx, "use client")
    │  owns reference/loading/error/order state; reads ?ref= for deep links
    │
    ├─ OrderLookupForm            ← reference input + submit
    │
    ├─ apiClient.get(`/orders/${reference}`)
    │       ▼
    │  GET /api/orders/[reference]   (src/app/api/orders/[reference]/route.ts)
    │       │  calls ordersService.getOrderByReference() — unchanged
    │       ▼
    │  200 OrderRecord | 404/500 { error }
    │
    ├─ OrderDetailsCard            ← the 9 required fields
    │       │  resolves network display name/colour via catalogueService
    │       ▼
    │  PaymentStatusBadge / FulfillmentStatusBadge  (src/components/track/StatusBadge.tsx)
    │
    └─ OrderStatusTimeline         ← 4-stage stepper derived from both statuses
```

## File-by-file

### `src/app/api/orders/[reference]/route.ts`
`GET /api/orders/[reference]` — thin wrapper around
`ordersService.getOrderByReference()` (unchanged). Server-only, since that
service holds the Supabase service-role client. Response convention
matches `/api/checkout`: success body **is** the `OrderRecord` (200);
failure is `{ error }` with 404 (not found) or 500 (other). Uses the
`API.order(id)` constant already defined in `src/constants/index.ts` but
previously unused.

### `src/components/track/StatusBadge.tsx`
Generic `<StatusBadge tone label />` on top of the existing `Badge`
primitive, plus `PaymentStatusBadge`/`FulfillmentStatusBadge` — one lookup
table per status enum (`OrderPaymentStatus`/`OrderFulfillmentStatus` from
`src/types/order.ts`), so the tone/label mapping lives in exactly one
place per status type.

### `src/components/track/OrderStatusTimeline.tsx`
Pure presentation, four stages: **Order Created → Payment Received →
Processing → Delivered**. State per stage is one of `complete | current |
upcoming | failed | muted`, derived only from `paymentStatus` +
`fulfillmentStatus` — no props beyond those two, so it's reusable anywhere
an `OrderRecord`'s progress needs to be shown (a future thin dashboard
"my orders" view, per `ROADMAP.md`, could reuse it unmodified).

### Failure handling

| Condition | Stage 2 (Payment) | Stage 3 (Processing) | Stage 4 (Delivered) |
|---|---|---|---|
| `payment_status = "pending"` | `current` — "Awaiting Payment" | `upcoming` | `upcoming` |
| `payment_status = "paid"`, `fulfillment_status = "pending"` | `complete` | `current` — "Processing" | `upcoming` |
| `payment_status = "paid"`, `fulfillment_status = "processing"` | `complete` | `current` | `upcoming` |
| `payment_status = "paid"`, `fulfillment_status = "delivered"` | `complete` | `complete` | `complete` |
| `payment_status = "failed"` | `failed` — "Payment Failed" | `upcoming` (halted) | `upcoming` (halted) |
| `payment_status = "refunded"` | `muted` — "Refunded" | `upcoming` (halted) | `upcoming` (halted) |
| `fulfillment_status = "failed"` | `complete` | `failed` — "Delivery Failed" | `upcoming` (halted) |

Any `"failed"` stage renders a short "Contact support" link (`ROUTES.support`)
below the timeline — no ticket system, just a pointer to the existing
support path per `ROADMAP.md`'s V1 scope.

### `src/components/track/OrderDetailsCard.tsx`
Displays all 9 required fields: Order Reference, Network, Package, Phone
Number, Amount (via `formatGHS`), Payment Status, Fulfillment Status,
Created, Updated. `OrderRecord.network` only stores the raw network id
(e.g. `"mtn-express"`), so this component resolves the display name/colour
via `catalogueService.getNetworks()` — never `src/data/bundles.ts`
directly, per `catalogue.md`'s rule — falling back to the raw id if no
match is found.

### `src/components/track/OrderLookupForm.tsx`
Controlled reference input + submit button. Mobile-first: stacks
vertically by default, sits side-by-side from `sm:` up, matching the
breakpoint convention `BuyFlow.tsx`'s success screen already uses.
Accepts an `initialValue` so a deep link can prefill it.

### `src/components/track/OrderLookupView.tsx`
Client component owning all lookup state. Reads `?ref=` via
`useSearchParams()` to auto-run the first lookup when a customer arrives
from `BuyFlow`'s "Track Order" button (see below). Renders one of four
states: idle prompt, loading spinner, not-found/error message, or the
details card + timeline.

### `src/app/track/page.tsx` (modified)
Replaced the `ComingSoon` placeholder with `<OrderLookupView />`, wrapped
in a `<Suspense>` boundary (required by Next.js for any component using
`useSearchParams()` in the App Router). The `PageContainer`/`PageHeader`
shell is unchanged — same brand chrome as every other page.

### `src/components/buy/BuyFlow.tsx` (modified)
The existing "Track Order" button on the success screen now links to
`/track?ref=<reference>` instead of a bare `/track`, so a customer who
just paid lands directly on their new order's status. No other change.

## Mobile-first / branding

No new visual language: reuses `Card`/`Badge`/`Button`/`Input`/`Label`
primitives, the existing `brand`/`brand-solid`/`outline`/`destructive`/
`muted` badge tones, and the same receipt-row pattern as `OrderSummary.tsx`.
The timeline is a vertical stepper by construction, so it needs no
breakpoint-specific layout to remain usable on small screens; the details
card and timeline sit in a single column on mobile and a two-column grid
from `lg:` up.

## What this change explicitly does NOT do

- Does **not** call SuccessBizHub or any real fulfillment provider.
- Does **not** add an authenticated "my orders" list — guest lookup by
  exact reference only (`ordersService.getOrdersForUser` remains unused,
  same as before this phase).
- Does **not** poll or use websockets — the customer must resubmit the
  form (or reload with `?ref=`) to see an updated status.
- Does **not** modify `ordersService`, `checkoutService`, `paymentService`,
  the payment webhook, or any Supabase schema/migration.
- Does **not** add a new dependency.
