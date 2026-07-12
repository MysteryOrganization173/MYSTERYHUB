# Mystery Hub — Version 1 Implementation Plan (Phase 1)

> Author: Lead engineer (execution phase)
> Status: **Phase 1a (Backend Foundation) and Phase 1b (Authentication UI) implemented.** See the [Phase 1a completion log](#phase-1a-completion-log-backend-foundation) and [Phase 1b completion log](#phase-1b-completion-log-authentication-ui) below. Dashboards, wallet, marketplace, referrals, and payments remain out of scope and unbuilt.
> Inputs: `docs/ARCHITECTURE.md`, `docs/project-audit.md`, `docs/ROADMAP.md`, `docs/BRAND.md`
> Scope owner: `ROADMAP.md` remains the source of truth for release scope. This document breaks the first Version 1 milestone into an executable engineering plan.

---

## Phase 1b completion log (Authentication UI)

**Directive:** implement the authentication UI on top of the Phase 1a backend foundation — sign up, sign in, logout, a session provider, and a protected-route foundation — using Supabase Auth via the service layer only. Explicitly **not** started: dashboards, wallet, marketplace, referrals, payments.

### What was built

| # | Item | Delivered as |
|---|---|---|
| 1 | Sign up page | `src/app/sign-up/page.tsx` |
| 2 | Sign in page | `src/app/sign-in/page.tsx` |
| 3 | Logout functionality | `authService.signOut()` + `useAuth().signOut()`, wired into `Navbar` (desktop + mobile sheet) so it has a real entry point |
| 4 | Auth session provider | `src/providers/AuthProvider.tsx` (`useAuth()`), added to `AppProviders` |
| 5 | Protected route foundation | `src/components/shared/ProtectedRoute.tsx` — not yet consumed by any page, since no dashboard/account page exists |

**New files:** `src/services/auth.ts`, `src/types/auth.ts`, `src/providers/AuthProvider.tsx`, `src/components/forms/SignInForm.tsx`, `src/components/forms/SignUpForm.tsx`, `src/components/shared/ProtectedRoute.tsx`, `src/app/sign-in/page.tsx`, `src/app/sign-up/page.tsx`.

**Modified files:** `src/providers/AppProviders.tsx` (added `AuthProvider` to the composition root), `src/providers/index.ts`, `src/services/index.ts`, `src/components/shared/index.ts`, `src/components/forms/index.ts`, `src/components/layout/Navbar.tsx` (session-aware sign-in/out UI, see below).

**No new dependency added.** `react-hook-form`, `@hookform/resolvers`, and `zod` were already installed; `signInSchema`/`signUpSchema` already existed in `src/utils/validators.ts` from before this phase and needed no changes.

**Explicitly not touched:** `src/app/buy/**`, `src/components/buy/**`, `src/services/dataBundles.ts`, `src/services/orders.ts`/`profiles.ts` (untouched — no wiring between orders and the new session yet), any dashboard/wallet/marketplace/referrals route, any payment code.

### File-by-file explanation

**`src/types/auth.ts`**
Domain types for this phase: `AuthUser` (a slimmed-down `{ id, email, fullName }` projection of Supabase's `User`, so components never see the full Supabase SDK shape), `SignUpCredentials`/`SignInCredentials` (service-layer input, intentionally without the form-only `confirmPassword` field), and `mapSupabaseUser()`.

**`src/services/auth.ts`**
The only file in the app that imports the Supabase Auth SDK. Uses the anon-key **browser** client (`src/lib/supabase/client.ts`), not the server-only admin client from Phase 1a — auth flows are user-initiated from the browser. Exposes `signUp`, `signIn`, `signOut`, `getCurrentUser`, and `onAuthStateChange` (subscription helper, intended only for `AuthProvider`). Every method returns `ApiResponse<T>` (`{ data, error }`, never throws), matching `ordersService`/`apiClient` conventions. Session persistence relies on Supabase's default browser `localStorage` session — no cookie-based session (`@supabase/ssr`) was added, since nothing in this phase renders auth state on the server.

**`src/providers/AuthProvider.tsx`**
Client-only context provider. On mount, calls `authService.getCurrentUser()` once and subscribes via `authService.onAuthStateChange()` for the lifetime of the app; exposes `{ user, isLoading, signOut }` through `useAuth()`. Never imports the Supabase SDK directly — only `authService`. Added to `AppProviders` inside `TooltipProvider`, wrapping `children` (order chosen so auth state changes don't force `ThemeProvider`/`TooltipProvider` to re-mount).

**`src/components/shared/ProtectedRoute.tsx`**
A client component that reads `useAuth()`, shows a small branded spinner while the session is loading, redirects to `/sign-in` (via `ROUTES.signIn`) once loading finishes with no user, and otherwise renders `children`. **Not wired into any route** — there is no dashboard/wallet/account page yet. It exists purely as the "protected route foundation" requested, ready for the first protected page in a later phase to wrap its content with `<ProtectedRoute>`.

**`src/components/forms/SignInForm.tsx`**
Email + password form using `react-hook-form` + `zodResolver(signInSchema)` (schema already existed in `src/utils/validators.ts`). Calls `authService.signIn` only. Shows inline field errors, a form-level error banner, a show/hide password toggle, a "Forgot password?" link (to the already-reserved `ROUTES.forgotPassword` — no page built, out of scope), a link to `/sign-up`, and a success/error toast via the existing `sonner`-based `toast` utility. On success, redirects to `/` (no thin account/dashboard page exists yet to redirect to).

**`src/components/forms/SignUpForm.tsx`**
Name + email + password + confirm-password form using `zodResolver(signUpSchema)`. `confirmPassword` is validated client-side by the schema's `.refine()` but deliberately dropped before calling `authService.signUp` (which only accepts `SignUpCredentials`, no `confirmPassword`). Same error/toast/redirect conventions as `SignInForm`.

**`src/app/sign-in/page.tsx`** / **`src/app/sign-up/page.tsx`**
Server components (no `"use client"`) with `metadata` exports for SEO, following the same `PageContainer`/`Card` composition style as `src/app/buy/page.tsx`. Centered, mobile-first single-column layout with the existing `BrandLogo` (linked home) above the form card — no new visual language introduced, only existing `Card`, `Input`, `Label`, `Button` primitives and existing dark-theme/brand-green tokens.

**`src/providers/AppProviders.tsx` (modified)**
Added `AuthProvider` around `children`, updated the file's own doc comment (which previously listed `AuthProvider` as a "future provider to add") to reflect that it's now present.

**`src/providers/index.ts`, `src/services/index.ts`, `src/components/shared/index.ts`, `src/components/forms/index.ts` (modified)**
Barrel exports added for `AuthProvider`/`useAuth`, `authService`, `ProtectedRoute`, and `SignInForm`/`SignUpForm` respectively — closing the "stale barrel" gap the audit flagged, at least for the files touched in this phase.

**`src/components/layout/Navbar.tsx` (modified)**
The existing Navbar already hardcoded "Sign In" / "Get Started" links with no session awareness. To give requirement #3 ("logout functionality") an actual entry point, the right-side CTAs (desktop) and the mobile sheet footer now branch on `useAuth()`: signed-out users see the original Sign In/Get Started controls unchanged; signed-in users see an avatar (initial-based `AvatarFallback`, no new image asset needed) + name/email and a "Sign Out" button that calls `signOut()` from `useAuth()`. No layout restructuring, no new nav items, no dashboard link added — this is the minimum change needed to make logout reachable without building account UI.

### Manual testing steps (Phase 1b)

Continue from the Phase 1a steps (§9 above) — a working Supabase connection is a prerequisite.

1. **Install and type-check** (same as Phase 1a step A): `npm install && npm run type-check && npm run lint`. No new dependency was added this phase, so `npm install` should be a no-op if Phase 1a's install already ran.
2. **Sign up**: visit `/sign-up`, submit a new name/email/password. Expect a success toast, redirect to `/`, and the Navbar (desktop ≥ `sm` breakpoint and the mobile sheet) to switch from "Sign In / Get Started" to an avatar + name + "Sign Out".
3. **Verify persistence in Supabase**: in the Supabase Table Editor, confirm a new `auth.users` row exists and — thanks to the Phase 1a trigger — a matching `public.profiles` row was auto-created with the same `id`/`email`.
4. **Sign out**: click "Sign Out" in the Navbar (try both desktop and the mobile hamburger sheet). Expect the Navbar to revert to "Sign In / Get Started" immediately, no page reload required.
5. **Sign in**: visit `/sign-in`, submit the same credentials. Expect a "Welcome back" toast and redirect to `/`, Navbar reflecting the signed-in state again.
6. **Session survives reload**: while signed in, refresh any page. Expect a brief loading state (if visible at all) and then the signed-in Navbar state — confirms `authService.getCurrentUser()` correctly restores the session from Supabase's browser storage on mount.
7. **Validation errors**: submit `/sign-up` and `/sign-in` with invalid input (bad email format, short password, mismatched confirm-password). Expect inline field errors from the existing Zod schemas, no network call made, no crash.
8. **Wrong credentials**: sign in with a wrong password. Expect a form-level error banner and an error toast, no redirect, no crash.
9. **Protected route foundation (no live consumer yet)**: since no page uses `<ProtectedRoute>` yet, verify it manually by temporarily wrapping the `/buy` page's return value in `<ProtectedRoute>` in a local, uncommitted edit, then confirm signed-out visitors are redirected to `/sign-in` and signed-in visitors see the page normally. Revert the temporary edit afterward — `/buy` must remain unprotected/public per this phase's scope.
10. **Regression check**: confirm `/`, `/buy`, and all other existing routes still render exactly as before — only the Navbar's right-side CTA area should visually differ, and only based on auth state.

---

## Phase 1a completion log (Backend Foundation)

**Directive:** build the backend foundation only — Supabase connection, environment configuration, migrations, user/profile foundation, orders table foundation, and TypeScript database types. Explicitly **not** built yet: a complete authentication experience (sign-in/sign-up UI, session provider), dashboards, or any change to the buying UI (`/buy` and its components remain untouched and still use mock data).

**Funnel this foundation enables (not yet wired end-to-end):**

```
customer selects internet package
  → ordersService.createOrder()        [payment_status = pending, fulfillment_status = pending]
  → ordersService.updatePaymentStatus()  [independent column, updated by a future payment webhook]
  → ordersService.updateFulfillmentStatus() [independent column, can happen later]
  → ordersService.getOrderByReference()  [what a future /track page will call]
```

Payment and fulfillment are modeled as **two independent status columns** on `orders` rather than one combined status, so a paid-but-not-yet-delivered order is representable without ambiguity — matching the requested V1 priority order exactly.

### What was built

| # | Item | Delivered as |
|---|---|---|
| 1 | Supabase project connection | `src/lib/supabase/client.ts` (browser, anon key), `src/lib/supabase/admin.ts` (server-only, service role key) |
| 2 | Environment configuration | `isSupabaseConfigured` / `isSupabaseAdminConfigured` helpers added to `src/config/env.ts`; `.env.example` comments clarified |
| 3 | Database migrations | `supabase/migrations/0001_init_profiles_and_orders.sql` |
| 4 | User/profile foundation | `public.profiles` table + auto-provisioning trigger (migration), `src/types/profile.ts`, `src/services/profiles.ts` |
| 5 | Orders table foundation | `public.orders` table + status enums (migration), `src/types/order.ts`, `src/services/orders.ts` |
| 6 | TypeScript database types | `src/types/database.ts` |

**New dependency added:** `@supabase/supabase-js` (`^2.110.0`) only. No auth-cookie helper package (`@supabase/ssr`), no test runner, no ORM was added — all deferred until an actual consumer (auth UI, automated tests) needs them, per the "do not introduce unnecessary dependencies" directive.

**Explicitly not touched in this phase:** `src/app/buy/**`, `src/components/buy/**`, `src/services/dataBundles.ts`, `AppProviders`, any dashboard/account route, any sign-in/sign-up page or form.

### File-by-file explanation

**`supabase/migrations/0001_init_profiles_and_orders.sql`**
The single SQL migration for this phase. Creates:
- `public.profiles` — one row per `auth.users` row (`id` is both PK and FK to `auth.users.id`), with `email`, `full_name`, timestamps.
- `handle_new_user()` + `on_auth_user_created` trigger — automatically inserts a `profiles` row whenever a new `auth.users` row is created. Safe to have in place even though no sign-up UI exists yet; it just means profile rows won't need a backfill later.
- `public.order_payment_status` enum (`pending | paid | failed | refunded`) and `public.order_fulfillment_status` enum (`pending | processing | delivered | failed`).
- `public.orders` — one row per purchase attempt: `reference` (unique, public-facing), optional `user_id` (nullable to support guest checkout later), `network`, `bundle_id`, `bundle_name`, `recipient_phone`, `amount`/`currency`, and the two independent status columns plus `payment_reference` (reserved for a future payment provider ID).
- `set_updated_at()` + triggers on both tables to keep `updated_at` current automatically.
- RLS enabled on both tables with **select-only** owner policies (`auth.uid() = id` / `auth.uid() = user_id`). No insert/update policy for end users yet — all writes go through the service-role client in `src/services/*`, since there is no authenticated write path in the UI yet.

**`src/types/database.ts`**
Hand-authored Supabase-style `Database` type (`Tables.profiles`, `Tables.orders`, each with `Row`/`Insert`/`Update` shapes) that mirrors the migration exactly. Used to type both Supabase clients so every query is checked against real column names/types at compile time. Documented as regenerable later via `npx supabase gen types typescript` once the project is linked with the CLI.

**`src/types/profile.ts`**
Domain-level `Profile` type (camelCase) plus `mapProfileRow()` to convert a raw `ProfileRow` (snake_case) into it. Components/services should only ever see `Profile`, never `ProfileRow`, consistent with how `dataBundles.ts` already maps API shapes to domain types.

**`src/types/order.ts`**
Domain-level `OrderRecord` type (camelCase) plus `NewOrderInput` (what a caller provides to create an order) and `mapOrderRow()`. Named `OrderRecord`, not `Order`, specifically to avoid colliding with the pre-existing legacy mystery-box `Order` interface in `src/types/index.ts` — the audit flagged this exact ambiguity as a domain-drift risk, so a doc comment in the file points back to that concern.

**`src/lib/supabase/client.ts`**
Browser Supabase client built with the public anon key. Typed with `Database`. Safe to import from client components. Not consumed by any code yet — it exists so the first real consumer (a future auth UI) doesn't need new plumbing, only a new page/form.

**`src/lib/supabase/admin.ts`**
Server-only Supabase client built with the service role key, which bypasses Row Level Security. Includes a runtime guard (`if (typeof window !== "undefined") throw`) so that if this module is ever accidentally imported into client-bundled code, it fails loudly immediately rather than silently leaking a key (which in practice would already be an empty string client-side, since the service role key is not a `NEXT_PUBLIC_*` variable — this is a defense-in-depth check, not the only safeguard).

**`src/services/orders.ts`**
Server-only service module (imports the admin client). Exposes `createOrder`, `getOrderByReference`, `getOrdersForUser`, `updatePaymentStatus`, `updateFulfillmentStatus`, and a `generateOrderReference()` helper that reproduces the exact `MH-XXXXXX-XXXXXXXX` reference format already used by the mock in `dataBundles.ts`, so a future wiring change won't alter what customers see. Every method returns the same `ApiResponse<T>` shape (`{ data, error }`, never throws) used by `apiClient` elsewhere in the codebase, per the architecture's service-layer convention. **Not called from any route or component yet.**

**`src/services/profiles.ts`**
Server-only service module exposing a single `getProfile(userId)` read. Minimal on purpose — there is no profile-editing UI in this phase, only the read path needed once `orders.user_id` needs to resolve to a real user.

**`src/services/index.ts` (modified)**
Added barrel exports for `ordersService`, `generateOrderReference`, and `profilesService`, alongside the pre-existing `apiClient` and `bundlesService` exports.

**`src/config/env.ts` (modified)**
Added two derived booleans, `isSupabaseConfigured` and `isSupabaseAdminConfigured`, computed from the existing `supabaseUrl`/`supabaseAnonKey`/`supabaseServiceRoleKey` fields (which were already scaffolded before this phase). No new environment variable names were introduced — the ones documented in `ARCHITECTURE.md` were already correct.

**`.env.example` (modified)**
Comment-only change clarifying that the three Supabase variables are now required for the backend foundation to function, and reiterating that the service role key must stay server-only.

**`supabase/README.md` (modified)**
Rewritten to document the actual migration (table of what it creates), plus two setup paths: running the SQL directly in the hosted Supabase SQL editor (fastest for this phase) or via the Supabase CLI (optional, for later local development). Previously this file only described an aspirational, empty folder structure.

**`package.json` (modified)**
Added exactly one new dependency: `@supabase/supabase-js@^2.110.0`. No dev dependencies were added.

## 9. Manual testing steps (Phase 1a)

Automated tests were intentionally not added in this phase (not requested; a broader suite remains a later-phase item per the roadmap). Verify the foundation manually:

### A. Install and type-check

```bash
cd MysteryHub
npm install
npm run type-check
npm run lint
```
Expect both to pass with no errors related to `src/lib/supabase/*`, `src/services/orders.ts`, `src/services/profiles.ts`, or `src/types/{database,order,profile}.ts`.

### B. Provision Supabase and apply the migration

1. Create (or reuse) a Supabase project at supabase.com.
2. Copy `.env.example` to `.env.local` and fill in `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`.
3. Open the Supabase SQL editor and run `supabase/migrations/0001_init_profiles_and_orders.sql`.
4. In the Table Editor, confirm `public.profiles` and `public.orders` exist, RLS is **enabled** (green toggle) on both, and `orders` has the two enum columns (`payment_status`, `fulfillment_status`) defaulting to `pending`.

### C. Verify the trigger (profile auto-provisioning)

1. In Supabase Authentication → Users, manually add a test user (email + password).
2. In the Table Editor, open `public.profiles` and confirm a matching row appeared automatically with the same `id` and `email`.

### D. Exercise the services from a scratch script (no UI wiring exists yet)

Since nothing in the app calls these services yet, verify them directly. From the project root, create a throwaway file (do not commit it) such as `scripts/manual-test-orders.ts`:

```ts
import { ordersService, generateOrderReference } from "@/services";

async function main() {
  const reference = generateOrderReference();
  const created = await ordersService.createOrder({
    reference,
    network: "mtn-express",
    bundleId: "mtn-express-2gb",
    bundleName: "MTN Express 2GB",
    recipientPhone: "+233241234567",
    amount: 12.5,
  });
  console.log("createOrder:", created);

  const fetched = await ordersService.getOrderByReference(reference);
  console.log("getOrderByReference:", fetched);

  const paid = await ordersService.updatePaymentStatus(reference, "paid", "test-payment-ref");
  console.log("updatePaymentStatus:", paid);

  const delivered = await ordersService.updateFulfillmentStatus(reference, "delivered");
  console.log("updateFulfillmentStatus:", delivered);
}

main();
```

Run it with `npx tsx scripts/manual-test-orders.ts` (or `ts-node`, if preferred — neither is installed yet; install one temporarily or adapt to a Next.js Route Handler you delete afterward). Expected results:
- `createOrder` returns `{ data: { ...paymentStatus: "pending", fulfillmentStatus: "pending" }, error: null }`.
- `getOrderByReference` returns the same row.
- `updatePaymentStatus` returns `paymentStatus: "paid"`, `paymentReference: "test-payment-ref"`, and `fulfillmentStatus` **unchanged** (`"pending"`) — confirming the two statuses are independent.
- `updateFulfillmentStatus` returns `fulfillmentStatus: "delivered"` with `paymentStatus` still `"paid"`.
- In the Supabase Table Editor, confirm the row's `updated_at` changed after each update (verifies the trigger).

### E. Verify RLS is not accidentally bypassed by the anon client

1. In `src/lib/supabase/client.ts`'s client (anon key), attempt `supabaseBrowserClient.from("orders").select()` with no authenticated session (e.g. from a quick browser console test or a temporary client component).
2. Expect an **empty result**, not an error and not all rows — confirming the "owner-only select" policy is active and guests cannot enumerate orders.

### F. Regression check — existing app still works unmodified

1. Run `npm run dev`.
2. Load `/` and `/buy`, complete the existing mock purchase wizard end to end.
3. Confirm behavior is byte-for-byte the same as before this phase (still mock data, still the client-generated reference) — this phase must not change any user-visible behavior yet.

---

## Original Phase 1 plan vs. what was actually adjusted and built

The sections below (`§1`–`§8`, and "Explicitly not in this phase") are the **original** Phase 1 plan as first approved. The user then issued an **adjustment**: build only the backend foundation (items 1–6 below), explicitly excluding a complete auth experience, dashboards, and any buy-flow/currency changes. That narrower slice is what's documented in the [Phase 1a completion log](#phase-1a-completion-log-backend-foundation) above and is what has actually been built.

Kept below for traceability — each item is now tagged:
- **[BUILT — Phase 1a]** — implemented, see completion log above
- **[DEFERRED — Phase 1b]** — still planned, not built (auth UI, session provider, currency/locale change, `/track`, buy-flow wiring)

---

## Guiding constraints (carried over from docs, not re-decided here)

- Mystery Hub is a **digital services platform**. Internet packages are **one service**, not the brand.
- Do not redesign the project or replace the stack: **Next.js 15 App Router, React 19, TypeScript, Tailwind, shadcn/ui**, existing dark theme, `#18C964` green identity, mobile-first layout.
- Follow the existing layered architecture: `app/` pages → feature UI → `ui/` primitives → services/hooks/store/providers → config/constants/types/utils. Services never import components.
- Roadmap sequencing for V1 (do not reorder without revisiting `ROADMAP.md`):
  1. Scope & currency decision
  2. **Backend skeleton (auth + orders schema)** ← this plan
  3. SuccessBizHub read path wired into `/buy`
  4. Payment + webhook → order status
  5. SuccessBizHub fulfill/status + `/track`
  6. Chrome polish (legal, support, FAQ, 404/error, nav hygiene)
  7. Thin account home + launch checklist

---

## 1. Feature to build first

**Backend Skeleton: Supabase Auth + minimal Orders/Users schema, plus the currency/locale decision applied to shared config.**

Concretely, Phase 1 delivers:

- Supabase project wiring (`@supabase/supabase-js`, `@supabase/ssr`) with browser + server clients. **[BUILT — Phase 1a, minus `@supabase/ssr`, which was skipped as unnecessary until a session/cookie flow exists]**
- Auth: `/sign-in`, `/sign-up` pages backed by Supabase Auth (email/password to start; guest checkout remains supported for `/buy`). **[DEFERRED — Phase 1b]**
- A session provider wired into `AppProviders` so any component/page can read the current user. **[DEFERRED — Phase 1b]**
- Minimal Postgres schema (via Supabase migration): `users` (mirrors `auth.users` via a `profiles` table) and `orders` (status machine matching `ApiOrderResponse`). **[BUILT — Phase 1a, with a refinement: `orders` uses two independent columns, `payment_status` and `fulfillment_status`, instead of one combined `status`, per the user's explicit funnel description]**
- Currency/locale decision (GHS, Ghana-formatted) applied to `CURRENCY`, `formatCurrency`, and the mock bundle catalog — **not** a full payments integration yet. **[DEFERRED — Phase 1b; the `orders` table already defaults `currency` to `'GHS'`, but shared `CURRENCY`/mock catalog values were left untouched since that requires touching buy-flow-adjacent data]**

This phase deliberately stops **before** wiring SuccessBizHub or a payment rail — those are Phase 2 and Phase 3 per the roadmap sequencing and depend on the schema and auth session created here.

## 2. Why it is the correct priority

- **Everything downstream depends on it.** SuccessBizHub order persistence, the payment webhook → status update, `/track`, and the thin account home all need (a) a place to store an order row and (b) a way to know who placed it (or a guest reference). Building any of those first means either throwing away mock persistence or coupling payment logic to no schema.
- **Lowest risk, highest leverage.** The audit flags "Backend absence" and "Docs vs reality" (Supabase/Stripe documented but not installed) as high-severity gaps. Closing the backend gap first turns the paper stack into a real one before more UI is layered on top of it.
- **Unblocks parallel work safely.** Once `orders` + `profiles` tables and a session hook exist, the SuccessBizHub integration (Phase 2) and payment wiring (Phase 3) can be built and tested independently against a real (if minimal) persistence layer, matching the roadmap's stated sequence.
- **Currency decision is cheap and unblocks nothing else if deferred, but is free to do now.** It only touches `constants/index.ts`, `lib/utils.ts` (formatCurrency), and `data/bundles.ts` prices — no architectural risk, and every subsequent screen (buy, order summary, track) should display the correct currency from day one rather than being re-touched later.
- **Matches "platform, not feature sprawl."** No new user-facing service surface is added (checker, wallet, marketplace stay untouched); this phase is pure foundation for the one live service (internet packages) that V1 must ship.

## 3. Files that will change

### New files

| File | Purpose | Status |
|---|---|---|
| `supabase/migrations/0001_init.sql` | `profiles` and `orders` tables, enums, RLS policies | **BUILT** as `supabase/migrations/0001_init_profiles_and_orders.sql` |
| `supabase/seed.sql` | Optional local seed rows for manual testing | Skipped — not needed for foundation-only scope; add later if useful |
| `src/lib/supabase/client.ts` | Browser Supabase client (anon key) | **BUILT** |
| `src/lib/supabase/server.ts` | Server/Route Handler Supabase client (cookies-based, SSR-safe) | **DEFERRED** — replaced for now by `src/lib/supabase/admin.ts` (service-role, no cookies needed since there's no session yet) |
| `src/lib/supabase/middleware.ts` | Session refresh helper for `middleware.ts` | **DEFERRED** — no session to refresh yet |
| `middleware.ts` (repo root) | Refreshes Supabase session cookies on navigation | **DEFERRED** |
| `src/providers/AuthProvider.tsx` | React context exposing `user`, `session`, `isLoading`, `signOut` | **DEFERRED — Phase 1b** |
| `src/hooks/useUser.ts` | Thin hook over `AuthProvider` context | **DEFERRED — Phase 1b** |
| `src/services/auth.ts` | `authService`: `signUp`, `signIn`, `signOut`, `getSession` | **DEFERRED — Phase 1b** (no auth experience built yet) |
| `src/services/orders.ts` | `ordersService`: `createOrder`, `getOrderByReference`, `getOrdersForUser` | **BUILT**, plus `updatePaymentStatus`/`updateFulfillmentStatus` (not originally listed, added because payment/fulfillment are now separate columns) |
| `src/utils/validators.ts` (extend) | `signInSchema`, `signUpSchema` (Zod) | **DEFERRED — Phase 1b** |
| `src/app/sign-in/page.tsx` | Sign-in route | **DEFERRED — Phase 1b** |
| `src/app/sign-up/page.tsx` | Sign-up route | **DEFERRED — Phase 1b** |
| `src/components/forms/SignInForm.tsx` | Sign-in form | **DEFERRED — Phase 1b** |
| `src/components/forms/SignUpForm.tsx` | Sign-up form | **DEFERRED — Phase 1b** |
| `src/types/auth.ts` | `AuthUser`, `Session`, `SignInInput`, `SignUpInput` | **DEFERRED — Phase 1b** |
| `src/types/order.ts` | `OrderRecord`, `OrderStatus` | **BUILT**, with `paymentStatus`/`fulfillmentStatus` instead of one `status` field |
| `src/types/database.ts` | Not in original plan | **BUILT** — added because item 6 of the adjustment explicitly requested "TypeScript database types" |
| `src/types/profile.ts` | Not in original plan | **BUILT** — added to support item 4 ("user/profile foundation") without a full `auth.ts` |
| `src/services/profiles.ts` | Not in original plan | **BUILT** — minimal read-only counterpart to `orders.ts` |
| `src/lib/supabase/admin.ts` | Not in original plan | **BUILT** — server-only service-role client, used instead of a cookie-based server client since there's no session to manage yet |
| `.env.local` (developer-provided, gitignored) | Real Supabase project URL/keys for local dev | Developer action required — not something this phase can create for you |

### Modified files

| File | Change | Status |
|---|---|---|
| `src/providers/AppProviders.tsx` | Add `AuthProvider` to the composition root | **DEFERRED — Phase 1b** |
| `src/providers/index.ts` | Export `AuthProvider` | **DEFERRED — Phase 1b** |
| `src/services/index.ts` | Export `authService`, `ordersService` | **PARTIALLY BUILT** — exports `ordersService`, `generateOrderReference`, `profilesService`; `authService` deferred with Phase 1b |
| `src/constants/index.ts` | `CURRENCY.default = "GHS"`, etc. | **DEFERRED — Phase 1b** (currency/locale decision not applied to shared config or mock catalog in this pass) |
| `src/lib/utils.ts` | Confirm `formatCurrency` reads from `CURRENCY` constant | **DEFERRED — Phase 1b** |
| `src/data/bundles.ts` | Update mock prices from USD to GHS | **DEFERRED — Phase 1b** (buy-flow-adjacent data was explicitly out of scope this pass) |
| `src/types/bundle.ts` | Doc-comment update | **DEFERRED — Phase 1b** |
| `src/config/env.ts` | Confirm Supabase env vars are read; add guard | **BUILT** — added `isSupabaseConfigured` / `isSupabaseAdminConfigured` |
| `.env.example` | Clarify Supabase vars are now required | **BUILT** |
| `docs/ARCHITECTURE.md` | Document new services/Supabase status | **DEFERRED** — not touched this pass to keep the change set tight; recommended before Phase 1b starts |
| `package.json` | Add `@supabase/supabase-js`, `@supabase/ssr`; add a test runner | **PARTIALLY BUILT** — only `@supabase/supabase-js` added; `@supabase/ssr` and a test runner deliberately skipped (no session flow, no automated tests requested this pass) |
| `supabase/README.md` | Not in original plan | **BUILT** — rewritten to document the real migration instead of an aspirational empty folder |

No changes were made to `app/page.tsx`, `app/buy/page.tsx`, any `home/` or `buy/` component, or `src/services/dataBundles.ts` — confirmed untouched, per the adjustment's explicit instruction not to modify the buying UI yet.

## 4. Components required

**None of the components below were built in Phase 1a** — the adjustment explicitly excluded a complete auth experience and dashboards. Listed here as the still-pending Phase 1b scope:

- `SignInForm` / `SignUpForm` (`components/forms/`) — **DEFERRED — Phase 1b**.
- `AuthGuard` / `ProtectedRoute` helper — **DEFERRED — Phase 1b**.
- `UserMenu` (small addition to `Navbar`) — **DEFERRED — Phase 1b**.
- No changes to `buy/`, `home/`, `brand/`, or `ui/` primitive components — confirmed true in Phase 1a as well; nothing in `components/` was touched.

## 5. Services required

- `authService` (`src/services/auth.ts`) — **DEFERRED — Phase 1b.** No auth experience exists yet, so this service has no caller.
- `ordersService` (`src/services/orders.ts`) — **BUILT.** Implements `createOrder`, `getOrderByReference`, `getOrdersForUser`, plus `updatePaymentStatus`/`updateFulfillmentStatus` (added beyond the original plan because payment and fulfillment are tracked as two independent columns, not one `status` field). Not called from any route or component yet — see [Phase 1a completion log](#phase-1a-completion-log-backend-foundation).
- `profilesService` (`src/services/profiles.ts`) — **BUILT**, not in the original plan; minimal `getProfile(userId)` read added to support the "user/profile foundation" item.
- No change to `dataBundlesService` — confirmed untouched; it keeps serving mock catalog data. Phase 2 (SuccessBizHub) remains the phase responsible for replacing it.

## 6. Data models required

**Both tables below were BUILT, with one deliberate refinement from the original plan**: `status` was split into `payment_status` and `fulfillment_status` (two independent columns) instead of one combined field, to exactly match the funnel described in the adjustment ("order is created → payment status exists → fulfillment can happen later → customer can track order").

### `profiles` table (mirrors `auth.users`, 1:1) — BUILT

| Column | Type | Notes |
|---|---|---|
| `id` | `uuid` PK, FK → `auth.users.id` | |
| `email` | `text` | denormalized for convenience/display |
| `full_name` | `text nullable` | |
| `created_at` | `timestamptz default now()` | |
| `updated_at` | `timestamptz default now()` | added beyond the original plan, maintained by trigger |

### `orders` table — BUILT (with the payment/fulfillment split noted above)

| Column | Type | Notes |
|---|---|---|
| `id` | `uuid` PK default `gen_random_uuid()` | |
| `user_id` | `uuid nullable`, FK → `profiles.id` | nullable to support guest checkout per roadmap |
| `reference` | `text unique not null` | matches `ApiOrderResponse.reference` format (`MH-XXXX-XXXX`) |
| `network` | `text not null` | matches `NetworkId` |
| `bundle_id` | `text not null` | matches `DataBundle.id` (mock catalog ID for now; SuccessBizHub SKU id later) |
| `bundle_name` | `text not null` | added beyond the original plan — a display-name snapshot at time of order, since the mock catalog can change |
| `recipient_phone` | `text not null` | Ghana-formatted |
| `amount` | `numeric(10,2) not null` | |
| `currency` | `text not null default 'GHS'` | defaulted to GHS at the DB level even though the shared `CURRENCY` constant/mock catalog were left as USD this pass (see §3) |
| `payment_status` | `order_payment_status enum, default 'pending'` | `pending \| paid \| failed \| refunded` — replaces the originally planned single `status` field |
| `payment_reference` | `text nullable` | populated by a future payment webhook (Phase 1b+) |
| `fulfillment_status` | `order_fulfillment_status enum, default 'pending'` | `pending \| processing \| delivered \| failed` |
| `created_at` | `timestamptz default now()` | |
| `updated_at` | `timestamptz default now()` | |

### TypeScript types — BUILT

- `src/types/database.ts` — hand-authored `Database` type mirroring the migration exactly (item 6 of the adjustment).
- `src/types/order.ts` — `OrderRecord` (camelCase, with `paymentStatus`/`fulfillmentStatus`), `NewOrderInput`, `mapOrderRow()`.
- `src/types/profile.ts` — `Profile` (camelCase), `mapProfileRow()`.
- `src/types/auth.ts` (`AuthUser`, `SignInInput`, `SignUpInput`) — **DEFERRED — Phase 1b**, no auth experience yet.

### RLS policy summary (enforced in the migration, not just documented)

- `profiles`: user can `select` own row only (update policy also included). No client insert policy — rows are created only by the `handle_new_user` trigger.
- `orders`: user can `select` own rows (`user_id = auth.uid()`); guest orders (`user_id is null`) are **not** selectable by the anon client at all — they must be read via `ordersService.getOrderByReference` (service-role, server-only) once a `/track` route exists. No client insert/update policy — all writes go through `src/services/orders.ts`.

## 7. Testing approach (original plan)

This section described the testing approach for the *full* Phase 1 (including auth). Since auth was deferred, **no test runner or automated tests were added in Phase 1a** — the user's adjustment asked for manual testing steps instead, provided in [§9 above](#9-manual-testing-steps-phase-1a). The auth-specific items below (`authService`, `SignInForm`/`SignUpForm`, sign-up/sign-in smoke tests) remain **DEFERRED — Phase 1b** and should be revisited (including whether to add Vitest) once that phase starts.

1. Add a test runner: Vitest + React Testing Library — **DEFERRED**, not added; no unnecessary dependency introduced this phase.
2. Unit tests for `authService`, Zod auth schemas, `formatCurrency` post-GHS-change — **DEFERRED**, tied to Phase 1b work.
3. Unit tests for `ordersService` — **DEFERRED as an automated suite**, but manually exercised per §9.D above.
4. Component tests for `SignInForm`/`SignUpForm` — **DEFERRED**, no such components exist yet.
5. Manual smoke checklist — **superseded by** the Phase 1a manual testing steps in §9, which cover what was actually built (Supabase connection, migration, services) rather than auth/currency, which weren't built.

## 8. Risks (original plan, reconciled)

| Risk | Impact | Mitigation | Status |
|---|---|---|---|
| Supabase project not yet provisioned | Blocks all work | Create the project, populate `.env.local` before relying on the services | Still applies — see §9.B; developer action required |
| Adding `middleware.ts` at repo root can affect all routes | Could break unrelated routes | Scope the matcher narrowly | **Moot for Phase 1a** — no `middleware.ts` was added, since no session exists to refresh |
| Guest checkout + nullable `user_id` increases reference-guessing risk | Privacy/trust risk | Long, random, non-sequential reference (`generateOrderReference()`), no client-side "list all orders" path for guests | **Addressed** — `generateOrderReference()` built exactly this way; RLS has no guest-select policy at all |
| Currency change (USD → GHS) could visually break `/buy` | Regression risk | Treat as its own commit; visually verify buy flow | **Moot for Phase 1a** — currency/locale change was deferred, not built; `/buy` is unmodified |
| Scope creep into dashboard/wallet/SuccessBizHub | Feature sprawl | Hard boundary at sign-in/sign-up + orders table | **Reinforced** — this pass narrowed scope even further than originally planned, per the user's explicit adjustment |
| Domain-model naming collision (`Order` vs new order type) | Confusion, deepened drift | Name the new type `OrderRecord`, document the distinction | **Addressed** — done in `src/types/order.ts` |
| No CI/test pipeline | Type errors ship unnoticed | Run `type-check`/`lint` manually before merge | **Applies now** — see §9.A; run manually since this session's shell tooling was unavailable to run it automatically |

---

## Explicitly not in this phase (Phase 1a/1b) — reconciled with the roadmap

- ~~Complete authentication experience (sign-in/sign-up UI, session provider, `AuthProvider`, `authService`)~~ — **BUILT in Phase 1b** (see completion log above).
- Dashboards of any kind — **still deferred**; `ProtectedRoute` exists as a foundation but is not consumed by any page.
- Any change to the buying UI (`/buy`, `components/buy/**`, `dataBundlesService`) — **still deferred to Phase 2**; orders are not yet linked to the authenticated user in any UI flow.
- Currency/locale change (GHS in shared `CURRENCY` constant and mock catalog) — **still deferred**; not part of authentication scope.
- SuccessBizHub live integration — Phase 2 (unchanged from original roadmap).
- Any payment rail (MoMo/card) or webhook — Phase 3 (unchanged).
- `/track` UI — Phase 5 (unchanged; `ordersService.getOrderByReference` now exists to support it).
- Wallet, dashboard analytics, referrals, checker, marketplace, earn, agent, business — Version 2 / Future per `ROADMAP.md` (unchanged).
- Order confirmation email (Resend) — Version 2 (unchanged).
- Broad automated test suite / CI — Version 2 hygiene item (unchanged); only manual verification steps were provided for both Phase 1a and Phase 1b.
- Linking `orders.user_id` to the signed-in user at checkout time — deferred; `/buy` still creates no persisted order at all yet (Phase 2), so there is nothing to link.
