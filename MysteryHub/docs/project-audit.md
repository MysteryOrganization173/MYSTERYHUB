# Mystery Hub — Project Audit

> Audit date: July 12, 2026  
> Scope: `MysteryBundleHub/` codebase, `docs/`, branding, pages, and reusable components  
> Method: Full read of `docs/`, structure review, page/component inventory, design-system inspection  
> Constraint: No application code was modified for this audit

---

## Table of Contents

1. [Current Project Overview](#1-current-project-overview)
2. [Features Already Implemented](#2-features-already-implemented)
3. [Missing Pages](#3-missing-pages)
4. [Missing Reusable Components](#4-missing-reusable-components)
5. [Missing Documentation](#5-missing-documentation)
6. [Technical Concerns](#6-technical-concerns)
7. [Suggestions for Improving Maintainability](#7-suggestions-for-improving-maintainability)
8. [Prioritized Version 1 Checklist](#8-prioritized-version-1-checklist)

---

## 1. Current Project Overview

### Product identity

**Mystery Hub** is a **digital services platform** — not primarily an internet-packages site.

- Tagline: *Everything Digital. One Trusted Place.*
- Primary brand color: `#18C964` (dark-first UI)
- Ecosystem surfaces: digital & mobile services, internet packages (one offering), exam results checker (WAEC/BECE), wallet, marketplace, earn/referrals, agent/business tools
- Preferred copy: Digital Services, Mobile Services, Internet Packages, Digital Connectivity
- Avoid positioning around “cheap data” or a data-only brand

Legacy mystery-box marketplace scaffolding may still appear in unused types/categories; it is not the product narrative.

### Technical posture

| Layer | Status |
|---|---|
| Next.js 15 App Router + TypeScript | Present and in use |
| Tailwind + shadcn/ui design system | Present and in use |
| Homepage + `/buy` purchase wizard | Implemented (mock data) |
| Most secondary routes | Placeholder (`ComingSoon`) |
| Next.js API routes | None |
| Supabase / Stripe / Resend | Documented and env-scaffolded; **not installed or wired** |
| SuccessBizHub (data fulfillment) | Typed contract + mock service; **not live** |

### Architecture (as intended)

```
app/ pages → feature UI (home, buy, dashboard…) → layout / forms / cards
           → ui/ primitives
           → services / hooks / store / providers
           → config / constants / types / utils
```

Documented rule: layers import downward only; services never import components.

### Branding & design system (current)

| Token | Value |
|---|---|
| Name | Mystery Hub (`MH`) |
| Primary | `#18C964` → `brand-400` / CSS `--primary` |
| Theme | Dark by default (`globals.css` `:root`); light via `.light` |
| Fonts | Geist Sans, Geist Mono |
| Radius | `0.625rem` |
| Container | max `1400px` |
| Utilities | `.glow-brand`, `.glass`, `.text-gradient-brand`, `.shimmer`, `.section-padding`, `.container-padded` |
| Tokens source | `config/tokens.ts`, `config/brand.ts`, `tailwind.config.ts`, `globals.css` |

### Naming conventions (documented)

- Components: `PascalCase`
- Hooks: `use*` camelCase
- Services: `*Service` camelCase
- Constants: `SCREAMING_SNAKE_CASE`
- Routes: kebab-case folders
- Pages: default export; other components: named export
- Barrels: `index.ts` per folder

### Docs folder inventory

| File | Purpose |
|---|---|
| `docs/ARCHITECTURE.md` | Layer diagram, stack, folders, state strategy, services, theme, aliases, env, naming, feature checklist |
| `README.md` (repo root) | Onboarding, stack, structure, theme, env (overlaps architecture; product description is outdated) |
| `supabase/README.md` | Intended Supabase layout; no migrations present |

---

## 2. Features Already Implemented

### App shell

- Root layout with fonts, metadata, SEO defaults, theme color
- `AppProviders`: `ThemeProvider` (dark default), `TooltipProvider`, Sonner toaster
- Sticky `Navbar`, `Footer`, `MobileNav`, `AnnouncementBanner`

### Brand system

- `BrandLogo`, `BrandIcon`, `LoadingBrand`
- Logo primitives: `LogoMain`, `LogoCompact`, `LogoIcon`, `LogoLoading`
- Brand config/constants/types (`config/brand.ts`, `constants/brand.ts`, `types/brand.ts`)
- Logo SVGs under `public/images/logos/`

### Homepage (`/`)

Eight composed sections:

1. `HeroSection`
2. `ServicesSection`
3. `FeaturedBundlesSection`
4. `TrustSection`
5. `CheckerBanner`
6. `ReferralSection`
7. `MarketplacePreview`
8. `FAQPreview`

Ghana-oriented metadata and keywords are set on the page.

### Buy / data purchase (`/buy`)

Full client-side 4-step wizard:

1. Network select → 2. Bundle select → 3. Ghana phone input → 4. Order review  
5. Mock success screen with synthetic order reference  

Components: `BuyFlow`, `PurchaseSteps`, `NetworkSelector`, `BundleGrid`, `BundleCard`, `PhoneInput`, `OrderSummary`.

Data: mock catalogs in `src/data/bundles.ts`; service `dataBundlesService` with intentional API swap points.

### Placeholder routes (scaffolded, not functional)

`/earn`, `/wallet`, `/dashboard`, `/support`, `/marketplace`, `/business`, `/agent`, `/referrals`, `/track`, `/faq` — each has metadata + `PageHeader` + `ComingSoon`.

### Foundation libraries

| Area | Implemented |
|---|---|
| UI primitives | Button, Card, Badge, Input, Textarea, Label, Separator, Skeleton, Dialog, Sheet, Dropdown, Tabs, Avatar, Accordion, Tooltip, toast |
| Layout primitives | PageContainer, PageHeader, Section, SectionHeader, Grid/Stack, FeatureRow, StatCard, CTAButtonGroup |
| Hooks | `useLocalStorage`, `useMediaQuery` (+ breakpoints), `useDebounce` |
| Utils | `cn`, currency/date/slug helpers, Zod auth/address schemas |
| Services | `apiClient`, `bundlesService` (mystery-box, unused by UI), `dataBundlesService` (mock) |
| Config | `siteConfig`, `env` / `serverEnv`, image paths, design tokens |
| Constants | Routes, API path map, pagination, brand, storage keys, query keys, currency (USD) |

---

## 3. Missing Pages

### Linked or constant-defined but no `page.tsx`

| Route | Referenced from |
|---|---|
| `/checker` | Homepage services, brand `SERVICES`, CheckerBanner |
| `/sign-in`, `/sign-up`, `/forgot-password` | `ROUTES`, nav labels |
| `/dashboard/orders`, `/dashboard/profile`, `/dashboard/referrals`, `/dashboard/wallet` | `ROUTES` |
| `/privacy`, `/terms`, `/cookies` | Footer legal links |
| `/about`, `/blog`, `/contact` | `ROUTES` |

### Exist as ComingSoon only (need real product UI for V1 or later)

| Route | Intended purpose |
|---|---|
| `/track` | Order status after purchase |
| `/wallet` | Balance, top-up, transactions |
| `/dashboard` | User command center |
| `/earn` | Tasks / rewards |
| `/referrals` | Codes, tracking, payouts |
| `/marketplace` | Digital goods catalog |
| `/support` | Help / tickets / chat |
| `/faq` | Full FAQ (homepage has preview only) |
| `/agent` | Reseller / agent program |
| `/business` | Bulk / B2B tools |

### Missing Next.js special files (recommended)

- `loading.tsx` / `error.tsx` / `not-found.tsx` (app-level or per-route)
- Any `app/api/**` route handlers

---

## 4. Missing Reusable Components

### Explicitly planned in barrels but not built

**`components/forms/`**

- FormField, SignInForm, SignUpForm, AddressForm, ReviewForm, ContactForm, NewsletterForm

**`components/cards/`**

- BundleCard (mystery-box; note: buy flow has its own `buy/BundleCard` for data SKUs), BundleCardSkeleton, ReviewCard, StatCard (layout already has StatCard), TestimonialCard, CategoryCard, TierCard

**`components/dashboard/`**

- DashboardShell, DashboardHeader, DashboardSidebar, StatsCard, OrdersTable, ReferralsPanel

**`components/sections/`**

- Barrel still lists planned sections that already live under `home/` — barrel is stale. Still missing as shared section primitives: HowItWorks, Categories, Testimonials, Stats, Newsletter, generic CTASection

**`components/shared/`**

- ErrorBoundary, AnalyticsProvider (noted in architecture / AppProviders comments)

### UI primitives referenced as future shadcn adds

Progress, Select, Popover, Switch, Checkbox (README). Also useful for V1 buy/auth: Alert Dialog, Scroll Area (Radix already in package.json for some; not all wrapped).

### Brand / marketing assets

Config expects hero, banners, marketplace, referrals, utilities, announcements, checkers images; only logo SVGs are present under `public/`. No OG image file matching all configured paths.

### Service / state gaps (component-adjacent)

- Auth provider / session UI
- Cart / wallet balance display
- Order status components for `/track`
- Payment method selector
- Empty / error / offline states beyond `ComingSoon`

---

## 5. Missing Documentation

| Gap | Why it matters |
|---|---|
| **Product brief / PRD** | Docs still describe mystery boxes; UI is Ghana digital hub — no single source of product truth |
| **Domain model docs** | Two domains coexist (`types/index.ts` mystery boxes vs `types/bundle.ts` data SKUs) without guidance on which is canonical |
| **API / SuccessBizHub integration guide** | Only inline comments in `dataBundles.ts` / `types/bundle.ts` |
| **Brand guidelines doc** | Brand is split across README, architecture, `config/brand.ts`, `constants/brand.ts` — no dedicated brand doc |
| **Env & secrets runbook** | `.env.example` exists; no setup troubleshooting or which vars are required for local UI-only vs full stack |
| **Supabase schema / RLS docs** | Folder README only; no migrations or ERD |
| **Payments & currency** | Stripe assumed in docs; buy UI uses USD mocks for Ghana numbers — no payment/currency decision doc |
| **Contributing / code review checklist** | Feature checklist exists in architecture; no PR/contribution guide |
| **Changelog / roadmap** | See [`ROADMAP.md`](./ROADMAP.md) for Version 1 / 2 / Future |
| **Architecture accuracy pass** | `ARCHITECTURE.md` still says homepage is placeholder; omits `buy/`, `brand/`, `dataBundles`, current routes |
| **Component inventory** | No living catalog of implemented vs stub barrels |
| **Testing strategy** | No test docs or test suite |

---

## 6. Technical Concerns

### Product / domain drift (high)

- Naming: product naming is **Mystery Hub** (`package.json` name: `mystery-hub`).
- Dual models: mystery-box `Bundle` + Ghana `DataBundle` share vocabulary (“bundle”) and confuse ownership.
- `bundlesService` + `data/categories.ts` appear unused by current pages.
- Checker: homepage = WAEC/BECE; `constants/brand.ts` still says “Bundle Checker”.

### Docs vs reality (high)

- Architecture/README claim Supabase, Stripe, Resend, React Query, Zustand as part of the stack; **none are installed** (except RHF/Zod/Sonner/next-themes which are).
- Framer Motion is a dependency but barely used.
- Folder docs list image dirs and supabase migrations that are empty or missing.

### Backend absence (high)

- `apiClient` targets `/api/*` but **no API routes exist**.
- Buy “orders” are mock-only; success copy admits payments are not live.
- No auth, persistence, webhooks, or email.

### Consistency / maintainability (medium)

- `services/index.ts` exports `bundlesService` but not `dataBundlesService` (buy imports the latter directly).
- `home/index.ts`, `forms/`, `cards/`, `dashboard/`, `sections/` barrels are empty or stale while real components exist under `home/` and `buy/`.
- Currency constant is USD/`en-US` while product is Ghana-market.
- Phone Zod schema is generic E.164; buy flow uses Ghana-specific formatting in `PhoneInput` — validators not aligned.
- Footer/nav link to routes that 404 (`/checker`, legal pages) or are ComingSoon.

### Design / assets (medium)

- Heavy reliance on CSS glow/grid/gradients; few real product images.
- OG/social image paths configured but assets incomplete.
- Copyright year in brand meta still `2024`.

### Delivery risk (medium)

- SuccessBizHub integration is the critical path for real data delivery; until then `/buy` cannot fulfill.
- Payment rail for Ghana (Stripe cards vs MoMo / local PSP) is undecided in code.

### Quality gates (low–medium)

- No automated tests.
- No `not-found` / global error UI.
- Feature flags exist in env but maintenance mode is not enforced in layout.

---

## 7. Suggestions for Improving Maintainability

1. **Freeze the product definition**  
   One short `docs/PRODUCT.md`: Mystery Hub = digital services platform; internet packages are one service. List V1 surfaces (Buy / Internet Packages, Track, Auth, Wallet minimum). Mark unused legacy catalog types as deferred.

2. **Update architecture to match the tree**  
   Refresh `ARCHITECTURE.md` and `README.md`: real routes, `components/buy`, `components/brand`, `dataBundlesService`, mock-first backend status.

3. **Unify naming**  
   Prefer “Mystery Hub” everywhere (package name, env defaults, emails, docs). Rename “Mystery Bundle” only where it still means data SKUs.

4. **Clarify the two “bundle” types**  
   Keep mystery-box types under a namespaced module or archive folder; keep `DataBundle` as the active commerce type. Avoid exporting both as `Bundle` without prefixes.

5. **Keep barrels honest**  
   Export real home/buy components from barrels; remove or rewrite planned-component comments that describe already-built work elsewhere.

6. **Single integration checklist for SuccessBizHub**  
   Move the inline checklist into `docs/integrations/successbizhub.md` and keep `dataBundles.ts` as the only code touchpoint (as already designed).

7. **Currency & locale**  
   Decide GHS vs USD for display; update `CURRENCY`, `formatCurrency` defaults, and mock catalog together.

8. **Do not install backend packages until needed**  
   Prefer adding Supabase/Stripe/Zustand/React Query when a feature lands, then update docs — avoids “paper stack” drift.

9. **Route hygiene**  
   Either add stub pages for every footer/nav href or remove links until ready. Prefer no 404s from primary chrome.

10. **Shared UI for async states**  
    Extract `EmptyState`, `ErrorState`, `PageLoader` next to `ComingSoon` so placeholders and real pages share one pattern.

11. **Validators colocated with domain**  
    Add `ghanaPhoneSchema` used by `PhoneInput` / buy flow; keep generic `phoneSchema` for other uses or remove.

12. **Light V1 quality bar**  
    Add `not-found.tsx`, basic `error.tsx`, and `type-check` + `lint` in CI before large feature work.

---

## 8. Prioritized Version 1 Checklist

> **Release scope is owned by [`ROADMAP.md`](./ROADMAP.md).**  
> That document maps audit findings into Version 1 / Version 2 / Future with reasoning.  
> The lists below remain as a historical snapshot from the audit; prefer the roadmap when planning work.

**Version 1 goal (roadmap):** A polished digital services platform where a user can buy an internet package (one service), pay, get fulfillment or clear pending status, and track the order — with auth, support, legal, and no broken primary chrome.

**ASAP adjustment vs original audit P0/P1:** Full wallet and rich dashboard moved to **Version 2** so V1 can launch faster; FAQ/support/error pages stay in V1 for polish.

### P0 — Must ship for a usable V1 (see also ROADMAP.md → Version 1)

- [ ] Confirm product scope in writing (digital services platform; internet packages as one service, not the whole brand)
- [ ] Align naming: Mystery Hub across package, env, README, architecture
- [ ] SuccessBizHub: env vars, live `getNetworks` / `getBundles` / `placeOrder` / `getOrderStatus`
- [ ] Payment: choose and implement one rail (card and/or MoMo); replace mock checkout
- [ ] Persist orders (Supabase or equivalent) with statuses matching API
- [ ] `/track` real UI (lookup by reference + auth user’s orders)
- [ ] Auth: `/sign-in`, `/sign-up`, session provider, protected thin account/orders entry
- [ ] Fix broken chrome links: `/checker` (hide/unlink until V2), legal stubs minimum
- [ ] Currency/locale decision applied to buy UI and constants
- [ ] Update `ARCHITECTURE.md` + README to match reality
- [ ] `/faq` + minimal `/support`, `not-found` / `error`, maintenance mode, essential OG assets

### Originally P1 — now split (see ROADMAP.md)

**Still Version 1 (polish):** FAQ, support CTA, error/404, barrels/validators as time allows, OG assets, maintenance mode.

**Moved to Version 2:** full wallet, rich dashboard, order confirmation email (Resend).

### P2 — Post-V1 (see ROADMAP.md → Version 2 / Future)

- [ ] `/checker` WAEC/BECE → **Version 2**
- [ ] `/referrals` → **Version 2**
- [ ] `/earn` → **Future**
- [ ] `/marketplace` → **Future**
- [ ] `/agent` and `/business` → **Future**
- [ ] React Query / Zustand — only when needed
- [ ] Archive unused mystery-box catalog → Version 2 hygiene
- [ ] Broader test suite → Version 2; smoke path may land late V1
- [ ] Analytics (GA) → Future
- [ ] Framer Motion program → Future

### P3 — Documentation debt (parallel to V1)

- [ ] `docs/PRODUCT.md`
- [ ] `docs/integrations/successbizhub.md`
- [x] `docs/BRAND.md`
- [x] `docs/ROADMAP.md`
- [ ] Supabase ERD + first migration when DB is chosen
- [ ] Payments & currency decision record
- [ ] Keep this `project-audit.md` updated after each major milestone

---

## Appendix A — Page inventory snapshot

| Path | Implementation |
|---|---|
| `/` | Full homepage |
| `/buy` | Full mock purchase wizard |
| `/earn` | ComingSoon |
| `/wallet` | ComingSoon |
| `/dashboard` | ComingSoon |
| `/support` | ComingSoon |
| `/marketplace` | ComingSoon |
| `/business` | ComingSoon |
| `/agent` | ComingSoon |
| `/referrals` | ComingSoon |
| `/track` | ComingSoon |
| `/faq` | ComingSoon |
| `/checker` | **Missing** |
| Auth / legal / about / blog / contact | **Missing** |

## Appendix B — Component folder snapshot

| Folder | State |
|---|---|
| `ui/` | Substantial shadcn set |
| `layout/` | Shell + page primitives built |
| `brand/` | Built |
| `buy/` | Built |
| `home/` | Built (barrel empty) |
| `shared/` | ThemeProvider + ComingSoon |
| `forms/` | Stub only |
| `cards/` | Stub only |
| `dashboard/` | Stub only |
| `sections/` | Stub / stale plan list |

## Appendix C — Design system quick reference

- **Primary CTA:** `brand` / `variant="brand"` where defined; color `#18C964`
- **Surfaces:** near-black page, elevated cards via CSS variables / `.glass`
- **Typography:** Geist; hero uses extrabold + `.text-gradient-brand` on tagline fragment
- **Motion:** CSS pulse/ping and transitions dominate; Framer Motion not central yet
- **Network accents:** MTN `#FFD200` / `#FFA500`, AirtelTigo `#E30613`, Telecel `#CC0000`

---

*End of audit. Release planning continues in [`ROADMAP.md`](./ROADMAP.md).*
