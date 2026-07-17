# Mystery Hub — V1.5 Product Audit

**Date:** July 2026
**Scope:** Full-codebase audit performed at the start of the V1.5 "Product
Transformation" pass, before any V1.5 code changes. Written against the
actual state of this repository at commit `9afe04f` ("feat: complete V1
commerce foundation") — see "A note on scope" below for why this differs
from an earlier planning pass.

## A note on scope

Planning for this transformation was originally informed by exploring a
*different*, more advanced checkout of this codebase (one with a full
admin panel, a multi-page dashboard, `ADMIN_EMAILS`-gated middleware, a
live SuccessBizHub adapter, and three additional services). That work was
never committed to this repository and is **not present here**. This
audit — and the rest of the V1.5 work — is written against what actually
exists in this workspace: the V1 commerce foundation only (catalogue,
checkout, payment, order tracking), with **no admin panel, no
multi-page dashboard, no live supplier integration, and no
auth-gated middleware** of any kind. Where the original V1.5 plan assumed
"repurpose the existing admin panel," this pass instead had to build the
admin panel itself. That is reflected in the larger-than-planned scope of
the changes in this PR.

## What was already real and working (V1 foundation)

- **Catalogue** — mock, curated internet-package data (`src/data/bundles.ts`)
  behind a clean `CatalogueSource` interface, cached client-side.
- **Checkout + Paystack** — `POST /api/checkout` creates an order, then
  initializes a real Paystack transaction server-side; the Paystack popup
  opens with a live access code. Secrets never reach the client.
- **Payment webhook** — `POST /api/payments/webhook` verifies Paystack's
  HMAC signature and updates `orders.payment_status`. It did **not**
  trigger fulfillment or any referral logic — see below.
- **Order tracking** — `/track` looks up an order by public reference via
  a server route (`GET /api/orders/[reference]`), correctly avoiding a
  broad client-side query for guest orders.
- **Auth (Supabase)** — real sign-up/sign-in via `@supabase/supabase-js`,
  session held in browser storage (not a cookie — see "Architecture
  decision" below), a `profiles` row auto-created by a DB trigger.
- **Fulfillment pipeline** — fully designed (`SupplierAdapter` interface,
  retry strategy, in-memory attempts ledger) but **never called from
  anything** — no route, webhook, or cron invoked `fulfillmentService`.

## What was fabricated or missing (the actual "trust gap")

This is the core problem the V1.5 mission describes, and it was real:

- **Homepage marketing vs. reality.** `TrustSection`, `ReferralSection`,
  and the homepage FAQ preview all describe a live wallet + referral
  commission system ("unique link, instant wallet credit, withdraw
  anytime", "Up to 5%"). None of it existed: no `wallet_balance` column,
  no `referral_code`, no commission table, no withdrawal flow.
- **Dashboard was a `ComingSoon` stub.** `/dashboard` rendered a single
  placeholder component — no orders list, no wallet, no referrals, no
  quick actions, despite the page's own metadata promising all of that.
- **`/faq` was a `ComingSoon` stub** even though `FAQPreview` on the
  homepage already showed four real, specific answers — the two surfaces
  had already started to drift.
- **No admin panel existed at all.** No `/admin/*` routes, no
  `ADMIN_EMAILS` allowlist, no admin API routes, no way to manage orders,
  users, suppliers, or payouts.
- **Fulfillment was fully built but never wired.** An order could be paid
  in full and would sit at `fulfillment_status = "pending"` forever — the
  customer had no way to know their package was never actually delivered
  by a supplier, because no supplier was ever called.
- **No supplier abstraction was exercised.** `catalogueService.ts` and
  the (unwired) `fulfillmentService.ts` each had a single hardcoded
  `const source = mockCatalogueSource` / `const adapter = mockSupplierAdapter`
  swap point — real, but with nothing to swap to. No SuccessBizHub
  adapter existed in either layer.
- **Checkout could not link orders to accounts.** `POST /api/checkout`
  never resolved the caller's session, so even a signed-in user's paid
  orders had `user_id = null` — the dashboard's "your orders" would have
  had nothing to show even if it had been built.
- **Sign-up/sign-in had no value proposition.** Both forms were bare
  email/password with no benefits list, no trust signal, and no
  referral-aware messaging for anyone arriving via a `?ref=` link (there
  was no `?ref=` capture mechanism at all).
- **No live imagery.** `next.config.ts` allowed a Cloudinary remote
  pattern and `.env.example` referenced Cloudinary keys, but nothing in
  the codebase imported `next-cloudinary` or called the Cloudinary SDK —
  every image was a local static file (or, in most cases, simply absent).

## Architecture decision carried into V1.5: no cookie-based session

The existing Supabase client (`src/lib/supabase/client.ts`) deliberately
stores the session in the browser (`localStorage`), not a cookie — a
prior, explicit decision documented in that file ("adding [cookie-based
sessions via `@supabase/ssr`] now would be an unrequested dependency").

This matters for V1.5 because it rules out the "obvious" way to protect
`/admin/**`: Next.js middleware cannot read a session that only exists in
`localStorage`. Rather than force a larger, riskier migration to
`@supabase/ssr` for this pass, every privileged route in this PR
(`/api/wallet/*`, `/api/admin/*`) instead requires the client to send the
current Supabase access token as a normal `Authorization: Bearer <token>`
header; the server verifies it directly against Supabase Auth
(`src/lib/supabase/serverAuth.ts`). This is the same trust boundary a
cookie would provide, carried over a header instead, and it means:

- `AdminGuard`/`ProtectedRoute` (client components) are **UX only** — they
  avoid flashing privileged UI to the wrong user, nothing more.
- The actual security boundary is that **every** `/api/admin/*` and
  `/api/wallet/*` route independently re-verifies the caller server-side,
  every time, regardless of what any page component already checked. See
  `docs/authentication.md` for the full write-up.
- Admin pages are therefore client components that fetch data through
  authenticated API routes, not Server Components reading the DB
  directly — a deliberate, honest consequence of the existing session
  model, not an oversight.

## What this V1.5 pass built

1. **Real wallet + referral + commission system** (migration `0003`,
   `src/services/wallet.ts`, `src/services/referrals.ts`) — wired into the
   Paystack webhook and a new full-balance "Pay with Wallet" checkout
   path. Idempotent by construction: a duplicate webhook delivery for the
   same order cannot double-credit a commission (unique constraint on
   `referral_commissions.order_reference`, checked by insert-then-credit,
   not check-then-insert).
2. **Real fulfillment wiring** — the previously-unwired
   `fulfillmentService` is now called from the webhook and the wallet
   checkout path, backed by a real supplier-switching registry
   (`src/services/suppliers/supplierRegistry.ts`) instead of a hardcoded
   mock constant.
3. **A first real supplier adapter** — `src/services/suppliers/successBizHub/`
   (catalogue + fulfillment). No public SuccessBizHub API documentation
   exists (confirmed by search); this adapter is written defensively
   against a conventional reseller-API shape and is explicitly flagged as
   unverified — it fails safe (falls back to the honest mock catalogue) on
   any error rather than fabricating supplier data.
4. **A real admin panel** — built from scratch (`/admin/*`), gated by
   `ADMIN_EMAILS` + `AdminGuard` + independent per-route server checks:
   dashboard stats, orders, users, suppliers (enable/priority), payout
   approvals, and referral analytics (replacing the never-built
   `/admin/agents` placeholder that was in the original mission brief but
   didn't exist in this checkout either).
5. **A real, personalized dashboard** — orders, wallet (balance + ledger +
   withdrawal requests), referrals (real link + real stats), and profile
   settings, replacing the `ComingSoon` stub.
6. **Referral-aware auth** — `?ref=<code>` capture (`ReferralCapture`),
   forwarded through signup to the DB trigger that resolves
   `referred_by`, plus a real benefits-led sign-up/sign-in redesign.
7. **A real `/faq` page** sourced from one shared data file also used by
   the homepage preview, so the two can no longer drift.
8. **Corrected homepage copy** — Trust/Referral/FAQ sections now describe
   the system that actually exists, because it now actually exists.

## Known, flagged limitations (deliberate, not oversights)

- **No cookie-based SSR session** (see above) — admin/wallet protection is
  bearer-token-based, not middleware-based.
- **Wallet ledger is not fully atomic.** Balance updates are
  read-then-write (no Postgres transaction/RPC exists in this codebase);
  under concurrent requests for the *same* user there is a narrow race.
  Referral commission crediting is protected at a stronger layer (a
  unique DB constraint), so double-crediting from a duplicate webhook is
  not possible even though the underlying wallet write isn't wrapped in a
  transaction.
- **Withdrawals are admin-mediated, not automated.** Requesting a
  withdrawal debits the wallet immediately; an admin later marks it
  "paid" after sending money through a channel outside this codebase (no
  Paystack Transfer/recipient-code integration, which requires business
  verification this pass doesn't have). Rejecting a request refunds it.
- **SuccessBizHub's wire format is unverified** — no public docs exist.
  The adapter is real code with a real (unverified) contract, not a
  simulation, but it needs correction against real sandbox responses
  before `SUCCESSBIZHUB_BASE_URL`/`SUCCESSBIZHUB_API_KEY` are set in
  production.
- **Commission rate (5%) and withdrawal minimum are placeholder business
  decisions**, matching pre-existing marketing copy, not verified
  numbers — both are single named constants, trivial to change later.
- **This environment has no Supabase/Paystack/Cloudinary credentials at
  all** (`.env.local` does not exist here) — nothing in this PR could be
  smoke-tested against a live database. Correctness was verified via
  `tsc --noEmit`, `next lint`, and `next build`, plus careful code review
  against the existing schema/RLS conventions — not live manual testing.
  See `docs/manual-testing-checklist.md` for the steps to run once real
  credentials are configured.
