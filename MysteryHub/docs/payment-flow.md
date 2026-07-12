# Mystery Hub — Payment Flow (V1 Phase 3: Payment Initialization)

> Status: **Architecture + Paystack initialization built and wired into `/buy`.**
> Payment is real (calls the live Paystack API once configured). Order
> **fulfillment** is NOT implemented — no SuccessBizHub call happens anywhere
> in this phase.
> Related: [`ARCHITECTURE.md`](./ARCHITECTURE.md), [`catalogue.md`](./catalogue.md),
> [`v1-implementation-plan.md`](./v1-implementation-plan.md), [`ROADMAP.md`](./ROADMAP.md).

---

## Scope

This phase implements exactly the flow requested, no more:

```
customer presses Continue (OrderSummary "Confirm Order")
        │
        ▼
   order created            ordersService.createOrder()   [payment_status = "pending"]
        │
        ▼
 payment initialized        paymentService.initializePayment()  →  Paystack /transaction/initialize
        │
        ▼
 Paystack popup or redirect resumePaystackTransaction() (client)  — popup, falls back to redirect
        │
        ▼
 pending payment status     (already set at order-creation time; nothing to do here)
        │
        ▼
 reference returned         CheckoutResult.reference → shown on the existing success screen
```

**Explicitly NOT part of this phase:**
- No order fulfillment (`fulfillment_status` is never touched by anything in
  this phase).
- No SuccessBizHub call, anywhere.
- The Paystack **webhook** (which later flips `payment_status` from
  `"pending"` to `"paid"`/`"failed"`) is built and documented below, but it
  only updates payment status — it does not fulfill orders either.

## Why Paystack

Directed explicitly for this phase. Paystack supports GHS, Ghana card
payments, and Mobile Money — matching `ROADMAP.md`'s "one Ghana-viable
payment method" requirement. The previously-scaffolded Stripe env vars
(`NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`, `STRIPE_SECRET_KEY`,
`STRIPE_WEBHOOK_SECRET`) were never wired to anything and remain untouched,
unused placeholders — Paystack is the live V1 rail.

## Why "resume transaction" (server-initialize + popup), not client-only

Two ways to use Paystack from a Next.js app:

1. **Client-only (`PaystackPop().newTransaction(...)`)** — the public key
   and amount live in client code. Simpler, but the amount/currency are
   client-controlled at charge time unless double-checked server-side.
2. **Server-initialize, then resume (chosen here)** — the server calls
   `POST /transaction/initialize` with the secret key, fixing amount,
   currency, and reference. The client only ever receives an `access_code`
   and uses `PaystackPop().resumeTransaction(access_code, callbacks)` to open
   the popup for that exact, already-fixed transaction. No public key is
   even required client-side for this call.

This repo uses option 2 end-to-end: `paystackClient.ts` (secret key) →
`paymentService.ts` → `checkoutService.ts` → `/api/checkout` → client gets
`{ accessCode, authorizationUrl }` → `resumePaystackTransaction()` opens the
popup, or redirects to `authorizationUrl` if the popup can't load. This is
exactly the "Paystack popup or redirect" requirement.

## Layer diagram

```
BuyFlow.tsx (client component)
    │  apiClient.post("/checkout", { network, bundleId, bundleName, recipientPhone, amount })
    ▼
POST /api/checkout  (src/app/api/checkout/route.ts)
    │  validates body, resolves a guest email if none supplied
    ▼
checkoutService.startCheckout()  (src/services/checkout.ts)
    │
    ├─ 1. ordersService.createOrder()          → order row, payment_status="pending"
    │
    └─ 2. paymentService.initializePayment()   (src/services/payments/paymentService.ts)
              │  converts GHS → pesewas (minor units)
              ▼
         paystackClient.initializeTransaction()  (src/services/payments/paystackClient.ts)
              │  POST https://api.paystack.co/transaction/initialize (secret key)
              ▼
         Paystack API → { authorization_url, access_code, reference }
    │
    ▼
{ orderId, reference, authorizationUrl, accessCode }  ← CheckoutResult, returned to client
    │
    ▼
BuyFlow.tsx: resumePaystackTransaction()  (src/lib/paystack/paystackPopup.ts)
    │  loads Paystack's inline.js, opens the popup for `accessCode`
    │  falls back to `window.location.href = authorizationUrl` on any failure
    ▼
Customer pays in the Paystack popup (or on the redirected Paystack page)
    │
    ▼
onSuccess(reference) → BuyFlow shows the existing success screen with the reference
    │
    │  (asynchronously, out of band:)
    ▼
POST /api/payments/webhook  (src/app/api/payments/webhook/route.ts)
    │  verifies x-paystack-signature, then for charge.success/charge.failed:
    ▼
ordersService.updatePaymentStatus(reference, "paid" | "failed")
    (fulfillment_status is never touched here)
```

## File-by-file

### Types — `src/types/payment.ts`
Client-safe (no runtime dependencies), so both server services and
`BuyFlow.tsx` can import from it:

- `CheckoutRequestBody` — what the client sends to `POST /api/checkout`.
- `StartCheckoutInput` / `CheckoutResult` — `checkoutService`'s input/output.
- `PaymentInitInput` / `PaymentInitResult` — `paymentService`'s input/output.
- `PaymentVerification` — shape for a future "verify on return" flow (see
  Not yet wired, below).
- `Paystack*` — Paystack's own wire shapes (`PaystackInitializeRequestBody`,
  `PaystackInitializeResponse`, `PaystackVerifyResponse`). Only
  `paystackClient.ts` and the webhook route should touch these directly.
- **Webhook models**: `PAYSTACK_EVENTS`, `PaystackChargeEventData`,
  `PaystackChargeWebhookEvent`, `mapPaystackChargeStatus()`.

### `src/services/payments/paystackClient.ts` (server-only)
The **only** file that calls Paystack's REST API. Wraps `fetch` with the
`Authorization: Bearer <secret key>` header, matching the `apiClient`
convention (`{ data, error }`, never throws). Has the same runtime guard
pattern as `src/lib/supabase/admin.ts` — throws immediately if ever
evaluated in a browser context. Exposes `initializeTransaction()` and
`verifyTransaction()`.

### `src/services/payments/paymentService.ts` (server-only)
Converts between our domain shapes (GHS major units, e.g. `9.99`) and
Paystack's wire shapes (minor units/pesewas, e.g. `999`). Exposes
`initializePayment()` (used by `checkoutService`) and `verifyPayment()`
(not called by any route yet — see Not yet wired, below).

### `src/services/payments/webhookVerifier.ts` (server-only)
`verifyPaystackSignature(rawBody, signatureHeader)` — HMAC SHA512 of the
raw request body using the Paystack secret key (Paystack has **no separate
webhook secret**, unlike Stripe — the same `PAYSTACK_SECRET_KEY` verifies
both API calls and webhooks), compared with `crypto.timingSafeEqual` to
avoid timing attacks.

### `src/services/payments/guestEmail.ts`
`synthesizeGuestEmail(recipientPhone)` — see Known limitation, below.

### `src/services/checkout.ts` (server-only)
`checkoutService.startCheckout()` — the orchestration described in Scope:
create the order, then initialize payment; if payment initialization fails,
marks the order's `payment_status` as `"failed"` (not left ambiguously
pending) and returns an error. Kept separate from the route handler so the
same orchestration could be reused by a Server Action or another entry
point later without duplicating logic.

### `src/app/api/checkout/route.ts`
`POST /api/checkout` — thin HTTP wrapper: validates the request body
(presence/type only), resolves a customer email (real one if given, else a
synthesized guest placeholder), and calls `checkoutService.startCheckout()`.
Response shape matches `apiClient`'s convention (`src/services/api.ts`):
on success the JSON body **is** the `CheckoutResult` directly (status 200);
on failure the body is `{ error: string }` with a non-2xx status —
`apiClient` wraps either case into its own `{ data, error }` on the client
side, so the route must not pre-wrap it.

### `src/app/api/payments/webhook/route.ts`
`POST /api/payments/webhook` — verifies the signature, then for
`charge.success`/`charge.failed` events only, calls
`ordersService.updatePaymentStatus(reference, "paid" | "failed", paystackId)`.
Runs on the Node.js runtime (`export const runtime = "nodejs"`) because
signature verification needs Node's `crypto` module. Any other event type is
acknowledged (`200`) and ignored. **This route does not exist in the
Paystack dashboard yet** — you must add its public URL there before it will
ever receive a real event; nothing calls it automatically in local dev.

### `src/lib/paystack/paystackPopup.ts` (client-only)
`resumePaystackTransaction()` — lazily injects Paystack's `inline.js` (v2)
script, then calls `new window.PaystackPop().resumeTransaction(accessCode, …)`.
Falls back to `window.location.href = authorizationUrl` if the script fails
to load, `window.PaystackPop` is unavailable, or the popup itself errors —
this is what satisfies "Paystack popup **or** redirect."

### `BuyFlow.tsx` (modified)
`handleConfirmOrder()` now: posts to `/api/checkout` → on success, calls
`resumePaystackTransaction()` → on the popup's `onSuccess`, shows the
existing success screen with the returned reference; on `onCancel`, simply
re-enables the "Confirm Order" button so the customer can retry. A new
`checkoutError` state renders a small inline error message under the order
summary if checkout itself fails (e.g. Paystack not configured, network
error) — no new visual language, matching the existing `text-destructive`
token already defined in `tailwind.config.ts`.

Copy changes (both `OrderSummary.tsx` and the success screen in
`BuyFlow.tsx`) were updated from "payment processing is coming soon" to
accurately describe that payment is now real and pending confirmation —
this was a necessary, minimal wording change given the underlying behavior
changed, not a redesign.

## Order/payment status semantics (unchanged schema)

No migration changes were needed — Phase 1a's `orders` table already models
exactly what this phase needs:

| Stage | `payment_status` | `fulfillment_status` |
|---|---|---|
| Order created (checkout starts) | `pending` | `pending` |
| Payment initialization fails | `failed` | `pending` (untouched) |
| Customer completes payment (webhook: `charge.success`) | `paid` | `pending` (untouched — no fulfillment in this phase) |
| Customer's payment fails (webhook: `charge.failed`) | `failed` | `pending` (untouched) |

`fulfillment_status` never changes anywhere in this phase's code. A later
phase (per `ROADMAP.md`'s sequencing) is responsible for reading
`payment_status = "paid"` orders and calling SuccessBizHub to fulfill them —
that is a new, separate piece of work, not touched here.

## Known limitation: guest checkout has no email field

Paystack requires an email address to initialize a transaction.
`BuyFlow`'s existing 4-step wizard (network → package → **phone** → review)
does not collect one, and adding a new form step/field was out of scope for
this phase (it would be a UI change beyond "payment only").

Resolution: `POST /api/checkout` accepts an optional `email` in
`CheckoutRequestBody`; when omitted (the only case today, since no caller
supplies one), `synthesizeGuestEmail(recipientPhone)` generates a
deterministic placeholder like `guest.233241234567@mysteryhub-checkout.invalid`
— using the `.invalid` TLD (RFC 2606) so nothing is ever emailed to a real
inbox by mistake. Paystack validates email *format* only, not
deliverability, so this is accepted.

**Follow-up (not built here):** once a real email is collected — either via
a new form field or a signed-in user's account email (`authService`/
`AuthProvider` already exist) — pass it through as `CheckoutRequestBody.email`.
No other file needs to change; `checkoutService` and `paymentService` already
accept a real email as their normal path.

## Not yet wired (prepared, intentionally unused)

- **`paymentService.verifyPayment()`** — calls Paystack's
  `GET /transaction/verify/:reference` directly. Useful for a future
  "confirm payment status when the customer returns from a redirect"
  screen, or as a manual reconciliation tool. No route calls it yet.
- **Webhook idempotency/audit log** — the webhook handler currently updates
  `payment_status` directly on every valid `charge.success`/`charge.failed`
  event without persisting the raw event first. This is safe (repeatedly
  setting the same status is a no-op in effect) but not auditable. A future
  phase could add a `payment_events` table and log the raw payload before
  acting on it, without changing this route's public contract.
- **Fulfillment trigger on `payment_status = "paid"`** — deliberately not
  built. See Order/payment status semantics, above.

## Configuration

Add to `.env.local` (see `.env.example`):

```
NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY=pk_test_...   # not required by the current flow, kept for future use
PAYSTACK_SECRET_KEY=sk_test_...               # required — server-only, never prefix with NEXT_PUBLIC_
```

`isPaystackConfigured` (in `src/config/env.ts`) is `true` once
`PAYSTACK_SECRET_KEY` is set; `paystackClient` returns a clear
`{ data: null, error: "Paystack is not configured…" }` instead of an opaque
fetch failure when it isn't.

To receive real webhook events, add `https://<your-domain>/api/payments/webhook`
as a webhook URL in the Paystack dashboard (Settings → API Keys & Webhooks).
Local testing requires a tunnel (e.g. ngrok) pointed at that route, or the
Paystack CLI's webhook-forwarding tool — neither is configured by this
change.

## What this change explicitly does NOT do

- Does **not** fulfill any order (`fulfillment_status` is never modified).
- Does **not** call SuccessBizHub, anywhere.
- Does **not** add a new payment rail beyond Paystack, and does not touch
  the unused, scaffolded Stripe env vars.
- Does **not** add an email collection step to the buy flow's UI — see
  Known limitation, above.
- Does **not** persist raw webhook events (no new database table/migration).
- Does **not** redesign `OrderRecord`, the `orders` schema, or any existing
  component beyond the minimal `BuyFlow.tsx`/`OrderSummary.tsx` wiring and
  copy changes described above.
