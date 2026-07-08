/**
 * Brand Configuration — Mystery Hub
 * Dedicated brand file extending the base site config.
 * Single source of truth for all visual identity decisions.
 */

import type { BrandConfig } from "@/types/brand";

// ─── Core Brand Config ────────────────────────────────────────────────────────

export const brandConfig = {
  name: "Mystery Hub",
  shortName: "MH",
  tagline: "Everything Digital. One Trusted Place.",
  description:
    "Mystery Hub is your one trusted place for digital products, earning opportunities, and seamless transactions. Buy, earn, and grow — all in one premium platform.",

  palette: {
    primary: "#18C964",
    shades: {
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
  },

  images: {
    dirs: {
      logos:       "/images/logos",
      hero:        "/images/hero",
      banners:     "/images/banners",
      marketplace: "/images/marketplace",
      utilities:   "/images/utilities",
      referrals:   "/images/referrals",
      checkers:    "/images/checkers",
    },
    logo:      "/images/logos/logo.svg",
    logomark:  "/images/logos/logomark.svg",
    favicon:   "/favicon.ico",
    ogImage:   "/images/logos/og-image.png",
  },
} as const satisfies BrandConfig;

// ─── Dark Background System ────────────────────────────────────────────────────

export const darkBg = {
  /** True black — page root */
  page:     "#0a0a0a",
  /** Primary card / surface */
  surface:  "#111111",
  /** Elevated card, modals, popovers */
  elevated: "#1a1a1a",
  /** Subtle dividers and borders */
  border:   "#242424",
  /** Muted / placeholder text */
  muted:    "#888888",
  /** Even more muted — disabled text */
  subtle:   "#555555",
} as const;

// ─── Logo Variants — Size Map ─────────────────────────────────────────────────

/** Map from LogoSize to pixel value (used for SVG width/height). */
export const LOGO_SIZE_PX = {
  xs: 20,
  sm: 28,
  md: 36,
  lg: 44,
  xl: 56,
} as const;

export type LogoSizePx = (typeof LOGO_SIZE_PX)[keyof typeof LOGO_SIZE_PX];

// ─── Glow Shadows ─────────────────────────────────────────────────────────────

export const brandGlow = {
  sm:  "0 0 12px rgba(24, 201, 100, 0.25)",
  md:  "0 0 20px rgba(24, 201, 100, 0.35)",
  lg:  "0 0 40px rgba(24, 201, 100, 0.45)",
  xl:  "0 0 60px rgba(24, 201, 100, 0.55)",
} as const;

// ─── Image Sizing Presets ─────────────────────────────────────────────────────

export const imageSizes = {
  ogImage:    { width: 1200, height: 630 },
  heroBanner: { width: 1400, height: 700 },
  banner:     { width: 1200, height: 300 },
  card:       { width: 600,  height: 400 },
  thumbnail:  { width: 400,  height: 400 },
  icon:       { width: 40,   height: 40  },
  favicon:    { width: 32,   height: 32  },
} as const;
