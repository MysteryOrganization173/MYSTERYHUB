# Mystery Hub — Architecture Reference

> Digital services platform for connectivity, mobile services, marketplace tools, and more.
> Internet packages are one service within a broader ecosystem — not the sole product focus.
> Last updated: July 2026

---

## Table of Contents

1. [Tech Stack](#tech-stack)
2. [Folder Structure](#folder-structure)
3. [Architecture Layers](#architecture-layers)
4. [Component System](#component-system)
5. [State Management](#state-management)
6. [Services & API Layer](#services--api-layer)
7. [Type System](#type-system)
8. [Theme System](#theme-system)
9. [Path Aliases](#path-aliases)
10. [Environment Variables](#environment-variables)
11. [Naming Conventions](#naming-conventions)
12. [Adding New Features](#adding-new-features)

---

## Tech Stack

| Layer | Technology | Version |
|---|---|---|
| Framework | Next.js | 15 (App Router, Turbopack) |
| Language | TypeScript | 5 (strict mode) |
| Styling | Tailwind CSS | 3 |
| UI Components | shadcn/ui + Radix UI | latest |
| Animation | Framer Motion | 11 |
| Icons | Lucide React | latest |
| Forms | React Hook Form + Zod | 7 + 3 |
| Toasts | Sonner | 1 |
| Theme | next-themes | 0.4 |
| Date Utilities | date-fns | 4 |
| Database | Supabase (PostgreSQL) | — |
| Auth | Supabase Auth | — |
| Payments | Stripe | — |
| Email | Resend | — |

---

## Folder Structure

```
MysteryBundleHub/
│
├── src/
│   │
│   ├── app/                    # Next.js App Router
│   │   ├── layout.tsx          # Root layout (fonts, metadata, AppProviders)
│   │   ├── page.tsx            # Homepage (digital services hub)
│   │   ├── globals.css         # Base CSS variables + Tailwind layers
│   │   └── (routes)/           # Feature route groups added here
│   │
│   ├── components/
│   │   ├── ui/                 # shadcn/ui base primitives (Button, Card, Dialog…)
│   │   ├── layout/             # Navbar, Footer, Sidebar
│   │   ├── home/               # Homepage sections (Hero, Services, Trust…)
│   │   ├── buy/                # Internet package / mobile services purchase flow
│   │   ├── brand/              # Logo and brand components
│   │   ├── dashboard/          # Dashboard-specific components
│   │   ├── forms/              # Form components (SignIn, SignUp, Address…)
│   │   ├── cards/              # Service and product cards
│   │   ├── sections/           # Full-width page sections
│   │   └── shared/             # Cross-cutting (ThemeProvider, ErrorBoundary…)
│   │
│   ├── providers/
│   │   └── AppProviders.tsx    # Composition root — all React context providers
│   │
│   ├── lib/
│   │   └── utils.ts            # cn(), formatCurrency, formatDate, slugify…
│   │
│   ├── hooks/                  # Custom React hooks
│   │   ├── useLocalStorage.ts
│   │   ├── useMediaQuery.ts    # useIsMobile, useIsTablet, useIsDesktop
│   │   └── useDebounce.ts
│   │
│   ├── services/               # API service layer (no business logic)
│   │   ├── api.ts              # Base apiClient (get/post/put/patch/delete)
│   │   ├── dataBundles.ts      # Internet packages / mobile connectivity service
│   │   └── bundles.ts          # Legacy catalog service (scaffold)
│   │
│   ├── config/
│   │   ├── site.ts             # siteConfig — name, URL, nav, social links
│   │   ├── brand.ts            # Brand identity and palette
│   │   └── env.ts              # Type-safe env vars (env + serverEnv objects)
│   │
│   ├── constants/
│   │   └── index.ts            # ROUTES, API, PAGINATION, BRAND, STORAGE_KEYS…
│   │
│   ├── data/
│   │   └── categories.ts       # BUNDLE_CATEGORIES, BUNDLE_TIERS (static data)
│   │
│   ├── types/
│   │   ├── index.ts            # Domain types: User, Order, Review…
│   │   ├── bundle.ts           # Internet package / network types (DataBundle…)
│   │   └── brand.ts            # Brand system types
│   │
│   ├── utils/
│   │   ├── format.ts           # formatFileSize, formatNumber, formatRelativeTime…
│   │   └── validators.ts       # Zod schemas: signUpSchema, addressSchema…
│   │
│   ├── store/
│   │   └── index.ts            # Zustand store slices (to be implemented)
│   │
│   └── styles/
│       └── index.css           # Supplemental global styles
│
├── public/
│   ├── images/
│   │   ├── logos/              # Logo variants (SVG/WebP)
│   │   ├── hero/               # Hero section images
│   │   ├── banners/            # Promotional banners
│   │   ├── marketplace/        # Marketplace imagery
│   │   ├── referrals/          # Referral program assets
│   │   ├── utilities/          # Utility images (og-image, etc.)
│   │   ├── announcements/      # Announcement/promo assets
│   │   └── checkers/           # Checker pattern / background textures
│   ├── icons/                  # SVG icon files
│   └── illustrations/          # Marketing illustrations
│
├── supabase/
│   ├── migrations/             # SQL migration files
│   └── README.md               # Supabase setup instructions
│
├── docs/
│   ├── ARCHITECTURE.md         # This file
│   ├── BRAND.md                # Brand positioning & preferred language
│   ├── ROADMAP.md              # Version 1 / 2 / Future scope
│   └── project-audit.md        # Audit + technical debt
│
├── .env.example                # Environment variable template
├── .env.local                  # Local secrets (gitignored)
├── components.json             # shadcn/ui configuration
├── tailwind.config.ts          # Tailwind + design tokens
├── tsconfig.json               # TypeScript + path aliases
├── next.config.ts              # Next.js configuration
└── README.md                   # Developer onboarding guide
```

### Brand language (docs & UI copy)

Prefer: **Digital Services**, **Mobile Services**, **Internet Packages**, **Digital Connectivity**.

Do not position Mystery Hub as primarily a data-discount site. Internet packages are one offering within the platform.

---

## Architecture Layers

```
┌─────────────────────────────────────────────────┐
│                  Next.js Pages (app/)            │  ← Routing, data fetching (RSC)
├─────────────────────────────────────────────────┤
│    Section Components  |  Dashboard Components   │  ← Feature UI
├──────────────────────────────────────────────────┤
│   Cards  |  Forms  |  Layout  |  Shared          │  ← Reusable UI blocks
├──────────────────────────────────────────────────┤
│              UI Primitives (ui/)                 │  ← shadcn/ui / Radix
├──────────────────────────────────────────────────┤
│    Services  |  Hooks  |  Store  |  Providers    │  ← Business logic
├──────────────────────────────────────────────────┤
│      Config  |  Constants  |  Types  |  Utils    │  ← Foundation
└─────────────────────────────────────────────────-┘
```

**Rule:** each layer only imports from layers below it. Pages may call services. Services never import components.

---

## Component System

### Naming conventions
- `PascalCase` for all component files: `BundleCard.tsx`
- Default export for page components, named exports for everything else
- Co-locate styles, tests, and types in the same folder as the component
- Use `index.ts` barrel files for clean imports

### UI Primitives (`src/components/ui/`)
Built on Radix UI + shadcn/ui conventions. These are **unstyled headless primitives** with Tailwind variants applied via `cva()`. Never add business logic here.

### Shared components (`src/components/shared/`)
Cross-cutting concerns: `ThemeProvider`, future `ErrorBoundary`, `AnalyticsProvider`, etc.

---

## State Management

| State type | Solution | Where |
|---|---|---|
| Server / async data | React Query (to be added) | `services/` + page hooks |
| URL / filter state | `useSearchParams` + Next.js | Page components |
| Cart / UI modals | Zustand slices (to be added) | `store/` |
| Form state | React Hook Form | `components/forms/` |
| Theme | next-themes | `AppProviders` |

---

## Services & API Layer

`src/services/api.ts` — base `apiClient`:
- Wraps `fetch` with typed request/response
- Normalizes errors into `ApiResponse<T>`
- Never throws — always returns `{ data, error }`

`src/services/dataBundles.ts` — `dataBundlesService` (active commerce path):
- `getNetworks()` — mobile network options
- `getBundles(networkId)` — internet packages for a network
- `placeOrder()` / `getOrderStatus()` — purchase + tracking (mock until SuccessBizHub is live)

`src/services/bundles.ts` — `bundlesService` (legacy catalog scaffold):
- Paginated listing helpers; not the primary product surface

Add new service files as features grow: `ordersService`, `reviewsService`, `referralsService`, etc.

---

## Type System

Shared domain types live in `src/types/index.ts` (User, Order, Review, Referral, API helpers).

Active mobile / connectivity types live in `src/types/bundle.ts`:

- `NetworkId`, `NetworkOption`, `DataTier`
- `DataBundle` — internet package SKU (internal name; prefer “Internet Packages” in UI copy)
- Purchase flow + SuccessBizHub wire types

Brand system types live in `src/types/brand.ts`.

Zod schemas (for runtime validation) live in `src/utils/validators.ts`. Keep them in sync with the TypeScript types.

---

## Theme System

### Dark mode (default)
CSS variables defined in `globals.css` as the `:root` defaults. Light mode is an opt-in via `.light` class.

### Brand green
```
Primary: #18C964  →  hsl(146, 79%, 44%)
```

The `brand` scale in `tailwind.config.ts`:
```
brand-50  → #e8fdf1   (very light tint)
brand-400 → #18C964   (primary — use for CTAs)
brand-500 → #0fa84f   (hover states)
brand-700 → #096b33   (dark tint)
```

### Custom utilities (`globals.css`)
- `.glow-brand` / `.glow-brand-lg` — green glow shadow
- `.glass` / `.glass-card` — glassmorphism
- `.text-gradient-brand` — green gradient text
- `.shimmer` — loading skeleton animation
- `.section-padding` / `.section-y` — consistent spacing
- `.container-padded` — max-width container with padding
- `.no-scrollbar` — hide scrollbar cross-browser

---

## Path Aliases

All aliases resolve from `src/`:

| Alias | Resolves to |
|---|---|
| `@/*` | `src/*` |
| `@/components/*` | `src/components/*` |
| `@/lib/*` | `src/lib/*` |
| `@/hooks/*` | `src/hooks/*` |
| `@/services/*` | `src/services/*` |
| `@/providers/*` | `src/providers/*` |
| `@/types/*` | `src/types/*` |
| `@/utils/*` | `src/utils/*` |
| `@/config/*` | `src/config/*` |
| `@/constants/*` | `src/constants/*` |
| `@/styles/*` | `src/styles/*` |
| `@/data/*` | `src/data/*` |
| `@/store/*` | `src/store/*` |

---

## Environment Variables

| Variable | Side | Purpose |
|---|---|---|
| `NEXT_PUBLIC_APP_URL` | Client | Canonical app URL |
| `NEXT_PUBLIC_APP_NAME` | Client | App display name |
| `NEXT_PUBLIC_SUPABASE_URL` | Client | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Client | Supabase anonymous key |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Client | Stripe public key |
| `NEXT_PUBLIC_GA_ID` | Client | Google Analytics ID |
| `NEXT_PUBLIC_ENABLE_REFERRALS` | Client | Feature flag |
| `NEXT_PUBLIC_ENABLE_AFFILIATES` | Client | Feature flag |
| `NEXT_PUBLIC_MAINTENANCE_MODE` | Client | Maintenance mode flag |
| `SUPABASE_SERVICE_ROLE_KEY` | **Server only** | Supabase admin key |
| `STRIPE_SECRET_KEY` | **Server only** | Stripe secret key |
| `STRIPE_WEBHOOK_SECRET` | **Server only** | Stripe webhook secret |
| `RESEND_API_KEY` | **Server only** | Resend email key |
| `RESEND_FROM_EMAIL` | **Server only** | Sender email address |

Copy `.env.example` to `.env.local` and fill in values before running locally.

---

## Naming Conventions

| Thing | Convention | Example |
|---|---|---|
| Components | PascalCase | `BundleCard.tsx` |
| Hooks | camelCase with `use` prefix | `useDebounce.ts` |
| Services | camelCase + `Service` suffix | `bundlesService` |
| Constants | SCREAMING_SNAKE_CASE | `ROUTES.dashboard` |
| Types/Interfaces | PascalCase | `BundleCategory` |
| CSS classes (custom) | kebab-case | `.glow-brand` |
| Files (non-component) | camelCase | `utils.ts` |
| Route folders | kebab-case | `/how-it-works` |

---

## Adding New Features

1. **Types first** — add domain types in `src/types/index.ts`
2. **Constants** — add routes/API endpoints in `src/constants/index.ts`
3. **Service** — create `src/services/featureName.ts`
4. **Components** — build in the appropriate `components/` subfolder
5. **Page** — create `src/app/route-name/page.tsx`
6. **Export** — update the folder's `index.ts` barrel

Feature checklist:
- [ ] Types defined
- [ ] Route constant added
- [ ] Service layer created
- [ ] Zod validator if form input is involved
- [ ] Component folder + barrel updated
- [ ] Page created with metadata export
- [ ] Error and loading states handled
