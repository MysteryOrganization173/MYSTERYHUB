# Mystery Hub — Catalogue Layer

> Status: **Architecture built, mock-backed. SuccessBizHub is NOT connected.**
> Scope: replaces the hardcoded catalog access pattern that previously let
> `BuyFlow.tsx` import `src/data/bundles.ts` directly. This document explains
> the new `src/services/catalogue/` layer, how it maps to existing types,
> and exactly what changes when SuccessBizHub goes live.
> Related: [`ARCHITECTURE.md`](./ARCHITECTURE.md), [`ROADMAP.md`](./ROADMAP.md),
> [`v1-implementation-plan.md`](./v1-implementation-plan.md).

---

## Why this exists

Before this change, `/buy` read internet-package catalog data two different,
inconsistent ways:

- `BuyFlow.tsx` imported `NETWORK_OPTIONS` / `getBundlesByNetwork` **directly**
  from `src/data/bundles.ts` (the mock catalog), bypassing the service layer
  entirely.
- `dataBundlesService.getNetworks()` / `getBundles()` existed but were
  **unused** by any component — dead code duplicating the same mock data.

Neither path had caching, a real loading/error contract, a currency decision,
or a documented seam for the SuccessBizHub integration described in
`ROADMAP.md` (Phase 2 of the V1 sequencing: *"SuccessBizHub read path wired
into `/buy`"*). This layer fixes that without redesigning `DataBundle` /
`NetworkOption` or any component's visual behaviour.

## What changed, at a glance

| Before | After |
|---|---|
| `BuyFlow.tsx` → `src/data/bundles.ts` (direct import) | `BuyFlow.tsx` → `catalogueService` → `mockCatalogueSource` → `src/data/bundles.ts` |
| `dataBundlesService.getNetworks/getBundles` (unused, duplicated mock reads) | Removed. `dataBundlesService` now only owns order placement/status (`placeOrder`, `getOrderStatus`) |
| No cache | In-memory TTL cache per network / bundle list |
| No loading/error contract for catalog reads | `ApiResponse<T>` (`{ data, error }`) + `catalogueService.isLoading()` |
| Prices implicitly USD, no `currency` field | `DataBundle.currency` is always `"GHS"`, attached by the mapper |
| No admin override hook | `getAdminBundleOverrides()` / `getAdminNetworkOverrides()` — no-op today, wired into every read |

## Layer diagram

```
BuyFlow.tsx (component)
    │  catalogueService.getNetworks() / getBundles(networkId)
    ▼
catalogueService.ts                  ← public API, never throws, returns ApiResponse<T>
    │
    ├─ CatalogueCache                 ← TTL cache, keyed per network/list
    ├─ applyNetworkOverrides / applyBundleOverrides   ← admin override hook (no-op today)
    ├─ networkMapper.mapNetwork()     ← raw → NetworkOption
    ├─ bundleMapper.mapBundle()       ← raw → DataBundle (attaches currency, resolves tier)
    │     └─ tierMapper.resolveTier() ← normalizes/falls back the tier
    │
    ▼
CatalogueSource (interface)
    │
    ▼
mockCatalogueSource.ts               ← the ONLY implementation today
    │
    ▼
src/data/bundles.ts                  ← hardcoded mock payload (unchanged content)
```

**Rule going forward:** components and other services must call
`catalogueService`, never `src/data/bundles.ts` directly. That file is now an
implementation detail of `mockCatalogueSource`.

## File-by-file

### `src/services/catalogue/types.ts`
- `CatalogueSource` — the provider contract: `fetchNetworks()` and
  `fetchBundles(networkId)`. Any future data provider (mock or real)
  implements this and nothing else needs to change.
- `RawCatalogueBundle` / `RawCatalogueNetwork` — the shape a `CatalogueSource`
  hands back, **before** mapping. `RawCatalogueBundle` is `DataBundle` minus
  `currency`, because currency is never trusted from a raw payload — it's
  always attached by the catalogue layer itself (see Currency, below).
- `CATALOGUE_CURRENCY` — single constant, `"GHS"`.
- `AdminBundleOverride` / `AdminNetworkOverride` + `getAdminBundleOverrides()`
  / `getAdminNetworkOverrides()` — see Future admin override support, below.

### `src/services/catalogue/tierMapper.ts`
`resolveTier(rawTier, networkId)` — trusts a raw tier value only if it's one
of `"express" | "budget" | "standard"`; otherwise infers it from the network
id (same fallback logic that used to live inline inside the old
`dataBundlesService.mapBundle`).

### `src/services/catalogue/networkMapper.ts`
`mapNetwork(raw)` — raw provider network → `NetworkOption`. Trivial today
(the mock source already returns domain-shaped data) but is an explicit
seam: when a real provider has a different wire shape, only this function
changes.

### `src/services/catalogue/bundleMapper.ts`
`mapBundle(raw)` — raw provider bundle → `DataBundle`. Resolves the tier via
`tierMapper` and attaches `currency: CATALOGUE_CURRENCY`. Supersedes the
inline `mapBundle` that used to live in `dataBundlesService`.

### `src/services/catalogue/cache.ts`
`CatalogueCache<T>` — a minimal in-memory TTL cache (default 5 minutes, no
external dependency). `catalogueService` keeps one cache for the networks
list and one for bundle lists, keyed per network id (e.g.
`bundles:mtn-express`), so refreshing one network's bundles doesn't
invalidate another's.

### `src/services/catalogue/mockCatalogueSource.ts`
The only `CatalogueSource` implementation today. Wraps
`src/data/bundles.ts`'s existing `NETWORK_OPTIONS` / `getBundlesByNetwork`
behind the interface, with the same simulated network delay the old service
had. **This is the file a `successBizHubCatalogueSource.ts` will sit next to.**

### `src/services/catalogue/catalogueService.ts`
The public API. Exposes:

- `getNetworks({ forceRefresh? })` → `ApiResponse<NetworkOption[]>`
- `getBundles(networkId, { forceRefresh? })` → `ApiResponse<DataBundle[]>`
- `getBundle(bundleId, networkId)` → `ApiResponse<DataBundle | null>`
- `refresh()` → invalidates all cached catalogue data
- `isLoading()` → `true` while any catalogue fetch is in flight

Every call: checks the cache first (unless `forceRefresh` is set) → on a
miss, calls the active `CatalogueSource` → maps the result → applies admin
overrides → caches it → returns it. Failures are caught and returned as
`{ data: null, error: "<message>" }`, never thrown — matching every other
service in this codebase (`apiClient`, `ordersService`, `authService`).

### `src/services/catalogue/index.ts`
Barrel export — `catalogueService` plus the mapper functions and types, for
anything that needs them directly (e.g. a future admin panel or a test).

## Loading & error handling

`catalogueService` never throws. Every method returns `ApiResponse<T>`
(`{ data, error }`), the same convention `apiClient`/`ordersService`/
`authService` already use. There is no global loading store (no React
Query/Zustand — per `ROADMAP.md`, heavy client-state libraries are added only
when a feature needs them); instead:

- Each caller owns its own loading/error UI state around the awaited call,
  exactly like `SignInForm`/`SignUpForm` already do for auth calls.
- `BuyFlow.tsx` now has `networksLoading`/`networksError` and
  `bundlesLoading`/`bundlesError` local state, driving small inline
  loading/error states in steps 1 and 2 (spinner + text, or a short error
  message) — no new visual language, same muted-text conventions used
  elsewhere (`BundleGrid`'s existing empty state).
- `catalogueService.isLoading()` is available if a future shared/global
  indicator is ever needed, but nothing consumes it yet.

## Caching & refresh

- In-memory only, per browser session (no persistence, no server cache —
  intentionally simple until there's a real API with real latency/cost to
  amortize).
- Default TTL: 5 minutes per cache entry.
- `catalogueService.refresh()` invalidates everything, forcing the next
  read to re-fetch. Intended callers (not built yet): a future
  pull-to-refresh control, or an admin action that just changed a price.
- Per-call `{ forceRefresh: true }` bypasses the cache for a single read
  without invalidating it for other callers.

## Currency (GHS)

- `DataBundle.currency` is now a required field, always `"GHS"`.
- It is **attached by `bundleMapper`**, never read from a raw provider
  payload — so a future SuccessBizHub source cannot accidentally set the
  wrong currency; `catalogueService` is the single source of truth.
- Existing mock prices were **not** renumbered — only the displayed currency
  symbol changed, from `$` to `₵`, via a new `formatGHS()` helper in
  `src/lib/utils.ts`, used by `BundleCard`, `OrderSummary`, and the
  `BuyFlow` success screen. This was a deliberate, minimal choice: the
  currency/locale decision belongs to this catalogue layer, but repricing
  the mock catalog to realistic GHS amounts is a separate product decision
  left for a later phase (see `v1-implementation-plan.md`).
- The unrelated `CURRENCY` constant in `src/constants/index.ts` (still
  `"USD"`, used elsewhere/historically) was intentionally left untouched —
  it is not part of the catalogue layer and changing it is out of scope
  for this change.

## Future admin override support

No admin UI exists yet. `AdminBundleOverride` / `AdminNetworkOverride` (in
`types.ts`) and `getAdminBundleOverrides()` / `getAdminNetworkOverrides()`
are wired into `catalogueService` today as **no-op read hooks** — they
currently always return an empty array, so overrides never change any
output.

When an admin panel is built:

1. Replace the bodies of `getAdminBundleOverrides()` /
   `getAdminNetworkOverrides()` to read from a real store (e.g. a Supabase
   `catalogue_overrides` table) instead of returning `[]`.
2. Call `catalogueService.refresh()` after an admin saves a change, so the
   next read picks it up immediately instead of waiting for the cache TTL.
3. `catalogueService`, `BuyFlow.tsx`, and every mapper stay unchanged —
   this is the entire integration surface.

## What replacing the mock with SuccessBizHub will look like

This layer was built so that step is a **small, isolated change**:

1. Add `src/services/catalogue/successBizHubCatalogueSource.ts` implementing
   `CatalogueSource` (`fetchNetworks()` / `fetchBundles(networkId)`), calling
   the real SuccessBizHub endpoints via `apiClient` and returning
   `RawCatalogueNetwork[]` / `RawCatalogueBundle[]`.
2. In `catalogueService.ts`, change one line:
   ```ts
   const source: CatalogueSource = successBizHubCatalogueSource; // was mockCatalogueSource
   ```
3. If SuccessBizHub's tier/currency semantics differ, adjust `tierMapper.ts`
   / `bundleMapper.ts` only — not `catalogueService.ts`, not any component.
4. Delete `src/data/bundles.ts` and `mockCatalogueSource.ts` once confirmed
   working (optional — keeping them around costs nothing and they may be
   useful for local development/tests without a live API).

No changes required in `BuyFlow.tsx`, `NetworkSelector.tsx`, `BundleGrid.tsx`,
`BundleCard.tsx`, or `OrderSummary.tsx` — they only ever consumed
`NetworkOption` / `DataBundle`, which do not change shape.

## What this change explicitly does NOT do

- Does **not** call SuccessBizHub or any real network catalog API.
- Does **not** implement payments.
- Does **not** change `ordersService`, `authService`, or `profilesService`.
- Does **not** redesign `DataBundle` / `NetworkOption` — only adds the
  required `currency` field.
- Does **not** add a new state-management dependency (React Query/Zustand) —
  consistent with `ROADMAP.md`'s "introduce only when a feature needs it"
  guidance.
- Does **not** change the visual design of `/buy` beyond: (a) the `$` → `₵`
  currency symbol, and (b) a brief loading/error state during the (now
  async) catalogue fetch in steps 1–2, which previously loaded synchronously
  from a hardcoded import.
