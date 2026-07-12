/**
 * Design Tokens — Mystery Hub
 *
 * Single source of truth for all design decisions.
 * These values align with tailwind.config.ts and globals.css.
 * Import these in component logic where you need typed design values.
 */

// ─── Color Palette ────────────────────────────────────────────────────────────
export const colors = {
  brand: {
    DEFAULT: "#18C964",
    50:  "#e8fdf1",
    100: "#c3f9dc",
    200: "#8bf2ba",
    300: "#4de695",
    400: "#18C964",
    500: "#0fa84f",
    600: "#0b8840",
    700: "#096b33",
    800: "#075228",
    900: "#053d1e",
  },
  dark: {
    bg:       "#0a0a0a",
    surface:  "#111111",
    elevated: "#1a1a1a",
    border:   "#242424",
    muted:    "#888888",
    subtle:   "#555555",
  },
} as const;

// ─── Typography ───────────────────────────────────────────────────────────────
export const typography = {
  fontFamily: {
    sans: "var(--font-geist-sans)",
    mono: "var(--font-geist-mono)",
  },
  fontSize: {
    xs:   ["0.75rem",  { lineHeight: "1rem" }],
    sm:   ["0.875rem", { lineHeight: "1.25rem" }],
    base: ["1rem",     { lineHeight: "1.5rem" }],
    lg:   ["1.125rem", { lineHeight: "1.75rem" }],
    xl:   ["1.25rem",  { lineHeight: "1.75rem" }],
    "2xl":["1.5rem",   { lineHeight: "2rem" }],
    "3xl":["1.875rem", { lineHeight: "2.25rem" }],
    "4xl":["2.25rem",  { lineHeight: "2.5rem" }],
    "5xl":["3rem",     { lineHeight: "1" }],
    "6xl":["3.75rem",  { lineHeight: "1" }],
  },
  fontWeight: {
    normal:   "400",
    medium:   "500",
    semibold: "600",
    bold:     "700",
    extrabold:"800",
  },
} as const;

// ─── Spacing ──────────────────────────────────────────────────────────────────
export const spacing = {
  // Component-level
  xs:  "0.25rem",  // 4px
  sm:  "0.5rem",   // 8px
  md:  "1rem",     // 16px
  lg:  "1.5rem",   // 24px
  xl:  "2rem",     // 32px
  "2xl":"3rem",    // 48px
  "3xl":"4rem",    // 64px
  // Section-level
  section: {
    xs: "py-8",
    sm: "py-12",
    md: "py-16 sm:py-20",
    lg: "py-20 sm:py-24 lg:py-32",
  },
  // Container padding
  container: {
    sm: "px-4",
    md: "px-4 sm:px-6",
    lg: "px-4 sm:px-6 lg:px-8",
  },
} as const;

// ─── Border Radius ────────────────────────────────────────────────────────────
export const radius = {
  none:  "0",
  sm:    "calc(var(--radius) - 4px)",  // ~6px
  md:    "calc(var(--radius) - 2px)",  // ~8px
  DEFAULT:"var(--radius)",             // 10px
  lg:    "var(--radius)",              // 10px
  xl:    "1rem",                       // 16px
  "2xl": "1.5rem",                     // 24px
  full:  "9999px",
} as const;

// ─── Shadows ──────────────────────────────────────────────────────────────────
export const shadows = {
  brand:     "0 0 20px rgba(24, 201, 100, 0.3)",
  brandLg:   "0 0 40px rgba(24, 201, 100, 0.4)",
  card:      "0 4px 6px -1px rgba(0,0,0,0.4), 0 2px 4px -1px rgba(0,0,0,0.3)",
  cardHover: "0 20px 25px -5px rgba(0,0,0,0.5), 0 10px 10px -5px rgba(0,0,0,0.4)",
  nav:       "0 1px 0 0 rgba(255,255,255,0.05)",
} as const;

// ─── Breakpoints ──────────────────────────────────────────────────────────────
export const breakpoints = {
  sm:  "640px",
  md:  "768px",
  lg:  "1024px",
  xl:  "1280px",
  "2xl":"1400px",
} as const;

// ─── Animation ────────────────────────────────────────────────────────────────
export const animation = {
  duration: {
    fast:    "150ms",
    normal:  "250ms",
    slow:    "400ms",
    verySlow:"700ms",
  },
  easing: {
    default:  "cubic-bezier(0.4, 0, 0.2, 1)",
    in:       "cubic-bezier(0.4, 0, 1, 1)",
    out:      "cubic-bezier(0, 0, 0.2, 1)",
    inOut:    "cubic-bezier(0.4, 0, 0.2, 1)",
    bounce:   "cubic-bezier(0.34, 1.56, 0.64, 1)",
  },
} as const;

// ─── Component Variants ───────────────────────────────────────────────────────
export const componentVariants = {
  card: {
    default: "bg-card border border-border rounded-xl shadow-card",
    glass:   "glass-card rounded-xl",
    elevated:"bg-card border border-border/50 rounded-xl shadow-card-hover",
  },
  badge: {
    brand:   "bg-brand/10 text-brand border border-brand/20",
    muted:   "bg-muted text-muted-foreground border border-border",
    success: "bg-green-500/10 text-green-400 border border-green-500/20",
    warning: "bg-yellow-500/10 text-yellow-400 border border-yellow-500/20",
    danger:  "bg-red-500/10 text-red-400 border border-red-500/20",
  },
  input: {
    default: "bg-input border border-border rounded-md focus-visible:ring-ring",
    error:   "bg-input border border-destructive rounded-md focus-visible:ring-destructive",
  },
} as const;

// ─── Layout ───────────────────────────────────────────────────────────────────
export const layout = {
  navHeight:       "4rem",    // 64px — h-16
  mobileNavHeight: "4rem",    // 64px — h-16
  announcementHeight: "2.5rem",
  containerMaxWidth: "1400px",
  sidebarWidth:    "16rem",   // 256px
  contentMaxWidth: "65ch",    // optimal reading width
} as const;

// ─── Grid ─────────────────────────────────────────────────────────────────────
export const grid = {
  cols: {
    1: "grid-cols-1",
    2: "grid-cols-1 sm:grid-cols-2",
    3: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
    4: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4",
    5: "grid-cols-2 sm:grid-cols-3 lg:grid-cols-5",
  },
  gap: {
    sm: "gap-4",
    md: "gap-6",
    lg: "gap-8",
  },
} as const;
