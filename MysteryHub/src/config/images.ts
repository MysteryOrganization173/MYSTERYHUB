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
    cloudinaryPublicId: "mystery-hub/og-image",
  } satisfies ImageEntry,
} as const;

// ─── Hero Assets ──────────────────────────────────────────────────────────────
// `hero-main.png` was generated on-brand for V1.5 (see
// docs/product-audit.md, "Phase 7 — Visual assets") and is committed to
// public/ as the working fallback; `cloudinaryPublicId` activates once
// `npm run assets:upload` has been run against a real Cloudinary account.

export const HERO_IMAGES = {
  main: {
    src:    "/images/hero/hero-main.png",
    alt:    "Mystery Hub — a premium digital services platform for Ghana",
    width:  1600,
    height: 900,
    cloudinaryPublicId: "mystery-hub/hero-main",
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
    alt:    "Refer friends and earn a real 5% commission on Mystery Hub",
    width:  1600,
    height: 900,
    cloudinaryPublicId: "mystery-hub/referral-banner",
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
    alt:    "Internet Package",
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
  emptyWallet: {
    src:    "/images/utilities/empty-wallet.png",
    alt:    "No wallet transactions yet",
    width:  512,
    height: 512,
    cloudinaryPublicId: "mystery-hub/empty-wallet",
  } satisfies ImageEntry,

  emptyOrders: {
    src:    "/images/utilities/empty-orders.png",
    alt:    "No orders yet",
    width:  512,
    height: 512,
    cloudinaryPublicId: "mystery-hub/empty-orders",
  } satisfies ImageEntry,

  emptyReferrals: {
    src:    "/images/utilities/empty-referrals.png",
    alt:    "No referrals yet",
    width:  512,
    height: 512,
    cloudinaryPublicId: "mystery-hub/empty-referrals",
  } satisfies ImageEntry,
} as const;

// ─── Referral Assets ──────────────────────────────────────────────────────────

export const REFERRAL_IMAGES = {
  /** Same asset as `BANNER_IMAGES.referral` — kept as one file on disk
   * (public/images/banners/referral-banner.png) rather than duplicated
   * under referrals/, referenced from both config groups for whichever
   * call site reads it. */
  banner: BANNER_IMAGES.referral,

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
