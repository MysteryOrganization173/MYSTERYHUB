/**
 * Brand Constants — Mystery Hub
 * Navigation labels, service names, and brand metadata.
 * All user-facing strings live here — never inline them.
 */

import type { ServiceMeta } from "@/types/brand";

// ─── Navigation Labels ────────────────────────────────────────────────────────

export const NAV_LABELS = {
  home:        "Home",
  buy:         "Buy",
  earn:        "Earn",
  wallet:      "Wallet",
  dashboard:   "Dashboard",
  support:     "Support",
  marketplace: "Marketplace",
  business:    "For Business",
  agent:       "Agent Hub",
  referrals:   "Referrals",
  track:       "Track Order",
  faq:         "FAQ",
  signIn:      "Sign In",
  signUp:      "Get Started",
  profile:     "Profile",
  settings:    "Settings",
  logout:      "Log Out",
} as const;

export type NavLabelKey = keyof typeof NAV_LABELS;

// ─── Service Names ────────────────────────────────────────────────────────────

export const SERVICE_NAMES = {
  marketplace: "Marketplace",
  bundles:     "Mystery Bundles",
  earn:        "Earn Hub",
  referrals:   "Referral Program",
  wallet:      "Digital Wallet",
  checker:     "Bundle Checker",
  track:       "Order Tracker",
  business:    "Business Suite",
  agent:       "Agent Hub",
} as const;

export type ServiceNameKey = keyof typeof SERVICE_NAMES;

// ─── Service Catalog ──────────────────────────────────────────────────────────

export const SERVICES: readonly ServiceMeta[] = [
  {
    id:          "buy",
    name:        "Buy",
    description: "Browse and purchase digital products and mystery bundles.",
    href:        "/buy",
    icon:        "ShoppingBag",
  },
  {
    id:          "marketplace",
    name:        "Marketplace",
    description: "Explore our full digital product marketplace.",
    href:        "/marketplace",
    icon:        "Store",
  },
  {
    id:          "earn",
    name:        "Earn",
    description: "Complete tasks, refer friends, and earn real rewards.",
    href:        "/earn",
    icon:        "TrendingUp",
  },
  {
    id:          "referrals",
    name:        "Referrals",
    description: "Share your referral link and earn commissions on every sign-up.",
    href:        "/referrals",
    icon:        "Users",
  },
  {
    id:          "wallet",
    name:        "Wallet",
    description: "Manage your balance, deposits, and withdrawals in one place.",
    href:        "/wallet",
    icon:        "Wallet",
  },
  {
    id:          "track",
    name:        "Track Order",
    description: "Real-time order tracking and delivery updates.",
    href:        "/track",
    icon:        "PackageSearch",
  },
  {
    id:          "business",
    name:        "For Business",
    description: "Bulk orders and white-label solutions for businesses.",
    href:        "/business",
    icon:        "Briefcase",
    isNew:       true,
  },
  {
    id:          "agent",
    name:        "Agent Hub",
    description: "Become a verified Mystery Hub reseller agent.",
    href:        "/agent",
    icon:        "BadgeCheck",
    isNew:       true,
  },
  {
    id:          "checker",
    name:        "Bundle Checker",
    description: "Verify and validate your bundle contents instantly.",
    href:        "/checker",
    icon:        "ScanLine",
  },
] as const;

// ─── Brand Metadata ───────────────────────────────────────────────────────────

export const BRAND_META = {
  name:            "Mystery Hub",
  shortName:       "MH",
  tagline:         "Everything Digital. One Trusted Place.",
  description:
    "Mystery Hub is your one trusted place for digital products, earning opportunities, and seamless transactions.",
  primaryColor:    "#18C964",
  email:           "hello@mysteryhub.com",
  supportEmail:    "support@mysteryhub.com",
  logoAlt:         "Mystery Hub Logo",
  logomarkAlt:     "Mystery Hub Icon",
  copyrightYear:   "2024",
  copyrightHolder: "Mystery Hub",
} as const;

export type BrandMeta = typeof BRAND_META;

// ─── Section / Page Titles ────────────────────────────────────────────────────

export const PAGE_TITLES = {
  home:        "Mystery Hub — Everything Digital. One Trusted Place.",
  buy:         "Buy Digital Products | Mystery Hub",
  earn:        "Earn Rewards | Mystery Hub",
  wallet:      "My Wallet | Mystery Hub",
  dashboard:   "Dashboard | Mystery Hub",
  marketplace: "Marketplace | Mystery Hub",
  referrals:   "Referral Program | Mystery Hub",
  track:       "Track Your Order | Mystery Hub",
  support:     "Support | Mystery Hub",
  faq:         "FAQ | Mystery Hub",
  business:    "Business Solutions | Mystery Hub",
  agent:       "Agent Hub | Mystery Hub",
  signIn:      "Sign In | Mystery Hub",
  signUp:      "Create Account | Mystery Hub",
} as const;

export type PageTitleKey = keyof typeof PAGE_TITLES;

// ─── Feature Flag Labels ──────────────────────────────────────────────────────

export const FEATURE_LABELS = {
  referrals:   "Referrals",
  affiliates:  "Affiliates",
  maintenance: "Maintenance Mode",
} as const;
