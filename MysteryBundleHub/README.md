# Mystery Bundle Hub

> A production-grade SaaS marketplace for curated mystery bundles.
> Discover surprise packages across tech, gaming, fashion, beauty, and more.

---

## Quick Start

```bash
# 1 — Install dependencies (requires Node.js 18+)
npm install

# 2 — Set up environment variables
cp .env.example .env.local
# → Fill in your Supabase, Stripe, and Resend credentials

# 3 — Start the development server
npm run dev
# Open http://localhost:3000
```

---

## Tech Stack

| Category | Package | Purpose |
|---|---|---|
| Framework | Next.js 15 | App Router, Turbopack, RSC |
| Language | TypeScript 5 | Strict mode, full type safety |
| Styling | Tailwind CSS 3 | Utility-first CSS |
| Components | shadcn/ui + Radix UI | Accessible UI primitives |
| Animation | Framer Motion 11 | Page transitions, micro-animations |
| Icons | Lucide React | Icon library |
| Forms | React Hook Form 7 | Performant form state |
| Validation | Zod 3 | Runtime schema validation |
| Toasts | Sonner | Notifications |
| Theme | next-themes | Dark/light mode |
| Dates | date-fns 4 | Date formatting & arithmetic |
| Database | Supabase | PostgreSQL + Auth + Storage |
| Payments | Stripe | Checkout + webhooks |
| Email | Resend | Transactional email |

---

## Folder Structure

```
src/
├── app/                  Next.js App Router pages & layouts
├── components/
│   ├── ui/               shadcn/ui primitives (Button, Card, Dialog…)
│   ├── layout/           Navbar, Footer, Sidebar
│   ├── home/             Homepage sections
│   ├── dashboard/        Dashboard feature components
│   ├── forms/            React Hook Form + Zod form components
│   ├── cards/            BundleCard, ReviewCard, StatCard…
│   ├── sections/         Full-width composable page sections
│   └── shared/           ThemeProvider, ErrorBoundary, cross-cutting
├── providers/            AppProviders — React context composition root
├── lib/                  cn(), formatCurrency, formatDate, slugify…
├── hooks/                useLocalStorage, useMediaQuery, useDebounce
├── services/             API layer — apiClient, bundlesService…
├── config/               siteConfig, env vars
├── constants/            ROUTES, API, PAGINATION, BRAND, STORAGE_KEYS
├── data/                 Static data — BUNDLE_CATEGORIES, BUNDLE_TIERS
├── types/                Domain types — User, Bundle, Order, Review…
├── utils/                format.ts, validators.ts (Zod schemas)
├── store/                Zustand state slices (placeholder)
└── styles/               Additional global styles

public/
├── images/
│   ├── logos/            Logo variants
│   ├── hero/             Hero section imagery
│   ├── banners/          Promotional banners
│   ├── marketplace/      Marketplace visuals
│   ├── referrals/        Referral program assets
│   ├── utilities/        OG image, misc
│   ├── announcements/    Announcement assets
│   └── checkers/         Background textures
├── icons/                SVG icons
└── illustrations/        Marketing illustrations

supabase/
└── migrations/           SQL migrations

docs/
└── ARCHITECTURE.md       Full architecture reference
```

---

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Dev server with Turbopack |
| `npm run build` | Production build |
| `npm run start` | Start production server |
| `npm run lint` | ESLint |
| `npm run type-check` | TypeScript check (no emit) |

---

## Theme & Design System

### Dark mode by default
The app ships dark-first. CSS variables in `globals.css` define the dark palette at `:root`. Light mode is an opt-in `.light` class toggle.

### Brand Green
```
Primary:  #18C964
HSL:      hsl(146, 79%, 44%)
```

### Design tokens (Tailwind)
```js
// Colors
brand-400  → #18C964   // CTAs, active states
brand-500  → #0fa84f   // Hover
brand-700  → #096b33   // Dark tint

// Custom utilities
.glow-brand          → Green glow shadow
.glass               → Glassmorphism card
.text-gradient-brand → Green gradient text
.shimmer             → Skeleton animation
.section-padding     → Responsive horizontal padding
.container-padded    → Max-width container
```

### Typography
- **Sans**: Geist Sans (variable font)
- **Mono**: Geist Mono (variable font)

---

## Architecture

See [`docs/ARCHITECTURE.md`](./docs/ARCHITECTURE.md) for the full technical reference including:
- Layer diagram
- Component system rules
- State management strategy
- Services API pattern
- Type system overview
- Naming conventions
- Feature development checklist

---

## Path Aliases

```ts
@/*              → src/*
@/components/*   → src/components/*
@/lib/*          → src/lib/*
@/hooks/*        → src/hooks/*
@/services/*     → src/services/*
@/providers/*    → src/providers/*
@/types/*        → src/types/*
@/utils/*        → src/utils/*
@/config/*       → src/config/*
@/constants/*    → src/constants/*
@/data/*         → src/data/*
@/store/*        → src/store/*
```

---

## Environment Variables

Copy `.env.example` to `.env.local` and fill in:

```bash
# App
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=          # Server only

# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
STRIPE_SECRET_KEY=                  # Server only
STRIPE_WEBHOOK_SECRET=              # Server only

# Email (Resend)
RESEND_API_KEY=                     # Server only
RESEND_FROM_EMAIL=

# Analytics
NEXT_PUBLIC_GA_ID=

# Feature Flags
NEXT_PUBLIC_ENABLE_REFERRALS=true
NEXT_PUBLIC_ENABLE_AFFILIATES=true
NEXT_PUBLIC_MAINTENANCE_MODE=false
```

---

## Adding shadcn/ui Components

After `npm install`, add more components with:

```bash
npx shadcn@latest add progress
npx shadcn@latest add select
npx shadcn@latest add popover
npx shadcn@latest add switch
npx shadcn@latest add checkbox
```

---

## Brand Guidelines

| Token | Value |
|---|---|
| Primary Color | `#18C964` |
| Default Theme | Dark |
| Font | Geist Sans / Geist Mono |
| Border Radius | `0.625rem` |
| Container Max Width | `1400px` |
