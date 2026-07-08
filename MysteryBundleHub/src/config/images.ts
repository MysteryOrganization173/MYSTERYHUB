/**
 * Image Configuration — Mystery Hub
 * Typed, structured paths for every public image asset.
 * Import from here — never hardcode /images/… paths in components.
 */

import type { ImageDirectoryConfig, ImageEntry } from "@/types/brand";

// ─── Directory Roots ──────────────────────────────────────────────────────────

export const IMAGE_DIRS: ImageDirectoryConfig = {
  logos:       "/images/logos",
  hero:        "/images/hero",
  banners:     "/images/banners",
  marketplace: "/images/marketplace",
  utilities:   "/images/utilities",
  referrals:   "/images/referrals",
  checkers:    "/images/checkers",
} as const;

// ─── Logo Assets ──────────────────────────────────────────────────────────────

export const LOGO_IMAGES = {
  /** Primary full-colour logo (icon + wordmark, dark bg) */
  primary: {
    src:    "/images/logos/logo.svg",
    alt:    "Mystery Hub",
    width:  180,
    height: 44,
  } satisfies ImageEntry,

  /** Icon-only logomark */
  logomark: {
    src:    "/images/logos/logomark.svg",
    alt:    "Mystery Hub Icon",
    width:  40,
    height: 40,
  } satisfies ImageEntry,

  /** Light variant (for use on dark backgrounds where colours are inverted) */
  logoLight: {
    src:    "/images/logos/logo-light.svg",
    alt:    "Mystery Hub",
    width:  180,
    height: 44,
  } satisfies ImageEntry,

  /** Dark variant (for use on white/light backgrounds) */
  logoDark: {
    src:    "/images/logos/logo-dark.svg",
    alt:    "Mystery Hub",
    width:  180,
    height: 44,
  } satisfies ImageEntry,

  /** Open Graph share image */
  ogImage: {
    src:    "/images/logos/og-image.png",
    alt:    "Mystery Hub — Everything Digital. One Trusted Place.",
    width:  1200,
    height: 630,
  } satisfies ImageEntry,
} as const;

// ─── Hero Assets ──────────────────────────────────────────────────────────────

export const HERO_IMAGES = {
  main: {
    src:    "/images/hero/hero-main.png",
    alt:    "Mystery Hub — digital products platform",
    width:  1400,
    height: 700,
  } satisfies ImageEntry,

  mobile: {
    src:    "/images/hero/hero-mobile.png",
    alt:    "Mystery Hub on mobile",
    width:  768,
    height: 500,
  } satisfies ImageEntry,

  illustrationRight: {
    src:    "/images/hero/illustration-right.png",
    alt:    "",
    width:  600,
    height: 600,
  } satisfies ImageEntry,
} as const;

// ─── Banner Assets ────────────────────────────────────────────────────────────

export const BANNER_IMAGES = {
  announcement: {
    src:    "/images/banners/announcement.png",
    alt:    "Mystery Hub announcement",
    width:  1200,
    height: 120,
  } satisfies ImageEntry,

  promo: {
    src:    "/images/banners/promo.png",
    alt:    "Mystery Hub promotion",
    width:  1200,
    height: 300,
  } satisfies ImageEntry,

  earn: {
    src:    "/images/banners/earn-banner.png",
    alt:    "Earn with Mystery Hub",
    width:  1200,
    height: 300,
  } satisfies ImageEntry,

  referral: {
    src:    "/images/banners/referral-banner.png",
    alt:    "Refer friends and earn",
    width:  1200,
    height: 300,
  } satisfies ImageEntry,
} as const;

// ─── Marketplace Assets ───────────────────────────────────────────────────────

export const MARKETPLACE_IMAGES = {
  placeholder: {
    src:    "/images/marketplace/placeholder.png",
    alt:    "Product image",
    width:  400,
    height: 400,
  } satisfies ImageEntry,

  bundleDefault: {
    src:    "/images/marketplace/bundle-default.png",
    alt:    "Mystery Bundle",
    width:  600,
    height: 400,
  } satisfies ImageEntry,

  categoryBanner: {
    src:    "/images/marketplace/category-banner.png",
    alt:    "Browse categories",
    width:  1200,
    height: 300,
  } satisfies ImageEntry,
} as const;

// ─── Utility / UI Assets ──────────────────────────────────────────────────────

export const UTILITY_IMAGES = {
  emptyState: {
    src:    "/images/utilities/empty-state.svg",
    alt:    "No results found",
    width:  200,
    height: 200,
  } satisfies ImageEntry,

  error: {
    src:    "/images/utilities/error.svg",
    alt:    "Something went wrong",
    width:  200,
    height: 200,
  } satisfies ImageEntry,

  comingSoon: {
    src:    "/images/utilities/coming-soon.svg",
    alt:    "Coming soon",
    width:  300,
    height: 200,
  } satisfies ImageEntry,

  success: {
    src:    "/images/utilities/success.svg",
    alt:    "Success",
    width:  200,
    height: 200,
  } satisfies ImageEntry,

  maintenance: {
    src:    "/images/utilities/maintenance.svg",
    alt:    "Under maintenance",
    width:  300,
    height: 200,
  } satisfies ImageEntry,
} as const;

// ─── Referral Assets ──────────────────────────────────────────────────────────

export const REFERRAL_IMAGES = {
  banner: {
    src:    "/images/referrals/referral-banner.png",
    alt:    "Refer & earn with Mystery Hub",
    width:  1200,
    height: 400,
  } satisfies ImageEntry,

  card: {
    src:    "/images/referrals/referral-card.png",
    alt:    "Your referral card",
    width:  600,
    height: 300,
  } satisfies ImageEntry,

  illustration: {
    src:    "/images/referrals/referral-illustration.svg",
    alt:    "Referral program",
    width:  400,
    height: 300,
  } satisfies ImageEntry,
} as const;

// ─── Checker Assets ───────────────────────────────────────────────────────────

export const CHECKER_IMAGES = {
  scan: {
    src:    "/images/checkers/scan-icon.svg",
    alt:    "Scan bundle",
    width:  100,
    height: 100,
  } satisfies ImageEntry,

  verified: {
    src:    "/images/checkers/verified.svg",
    alt:    "Bundle verified",
    width:  100,
    height: 100,
  } satisfies ImageEntry,

  invalid: {
    src:    "/images/checkers/invalid.svg",
    alt:    "Invalid bundle",
    width:  100,
    height: 100,
  } satisfies ImageEntry,
} as const;
