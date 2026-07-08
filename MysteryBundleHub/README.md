# Mystery Bundle Hub

A production-grade SaaS marketplace for curated mystery bundles.

## Tech Stack

- **Framework**: Next.js 15 (App Router, Turbopack)
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS v3 + shadcn/ui
- **Animation**: Framer Motion
- **Forms**: React Hook Form + Zod
- **Toasts**: Sonner
- **Icons**: Lucide React
- **Theme**: next-themes (dark mode default)
- **Database**: Supabase (PostgreSQL)
- **Payments**: Stripe
- **Email**: Resend

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Set up environment variables

```bash
cp .env.example .env.local
# Fill in your values in .env.local
```

### 3. Run development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
MysteryBundleHub/
├── src/
│   ├── app/                  # Next.js App Router pages
│   ├── components/
│   │   ├── ui/               # shadcn/ui base components
│   │   ├── layout/           # Header, Footer, Nav, Sidebar
│   │   ├── home/             # Homepage sections
│   │   └── shared/           # Cross-cutting components
│   ├── lib/                  # Core utilities (cn, etc.)
│   ├── hooks/                # Custom React hooks
│   ├── services/             # API service layer
│   ├── data/                 # Static data & constants
│   ├── types/                # TypeScript types & interfaces
│   ├── utils/                # Utility functions
│   └── config/               # Site config & env vars
├── public/
│   ├── images/               # Static images by category
│   ├── icons/                # SVG icons
│   └── illustrations/        # Marketing illustrations
├── supabase/                 # Supabase migrations & seed
└── ...config files
```

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server with Turbopack |
| `npm run build` | Production build |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |

## Adding shadcn/ui Components

After running `npm install`, add components using:

```bash
npx shadcn@latest add button
npx shadcn@latest add dialog
npx shadcn@latest add dropdown-menu
# etc.
```

## Environment Variables

See `.env.example` for all required environment variables.

## Brand Guidelines

- **Primary Color**: `#18C964` (Brand Green)
- **Default Theme**: Dark mode
- **Font**: Geist Sans / Geist Mono
- **Border Radius**: `0.625rem`
