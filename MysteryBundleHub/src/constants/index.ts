// ============================================================
// App-Wide Constants — Mystery Bundle Hub
// No magic strings/numbers anywhere else in the codebase.
// ============================================================

// ─── Routes ──────────────────────────────────────────────────────────────────
export const ROUTES = {
  home:        "/",
  bundles:     "/bundles",
  bundle:      (slug: string) => `/bundles/${slug}`,
  marketplace: "/marketplace",
  howItWorks:  "/how-it-works",
  pricing:     "/pricing",
  referrals:   "/referrals",
  affiliates:  "/affiliates",
  // Auth
  signIn:      "/sign-in",
  signUp:      "/sign-up",
  forgotPassword: "/forgot-password",
  // Dashboard
  dashboard:       "/dashboard",
  dashboardOrders: "/dashboard/orders",
  dashboardProfile:"/dashboard/profile",
  dashboardReferrals: "/dashboard/referrals",
  // Legal
  privacy:  "/privacy",
  terms:    "/terms",
  cookies:  "/cookies",
  // Company
  about:    "/about",
  blog:     "/blog",
  contact:  "/contact",
  help:     "/help",
} as const;

// ─── API Endpoints ────────────────────────────────────────────────────────────
export const API = {
  bundles:       "/api/bundles",
  bundle:        (slug: string) => `/api/bundles/${slug}`,
  featured:      "/api/bundles/featured",
  categories:    "/api/categories",
  orders:        "/api/orders",
  order:         (id: string) => `/api/orders/${id}`,
  reviews:       "/api/reviews",
  user:          "/api/user",
  referrals:     "/api/referrals",
  referralCode:  "/api/referrals/code",
  checkout:      "/api/checkout",
  webhookStripe: "/api/webhooks/stripe",
} as const;

// ─── Pagination ───────────────────────────────────────────────────────────────
export const PAGINATION = {
  defaultPage:      1,
  defaultLimit:     12,
  bundlesPerPage:   12,
  reviewsPerPage:   10,
  ordersPerPage:    20,
} as const;

// ─── Animation Durations (ms) ────────────────────────────────────────────────
export const DURATION = {
  fast:    150,
  normal:  250,
  slow:    400,
  verySlow:700,
} as const;

// ─── Local Storage Keys ───────────────────────────────────────────────────────
export const STORAGE_KEYS = {
  theme:       "mbh-theme",
  cartItems:   "mbh-cart",
  recentViews: "mbh-recent",
  filters:     "mbh-filters",
} as const;

// ─── Cookie Names ─────────────────────────────────────────────────────────────
export const COOKIES = {
  referralCode: "mbh-ref",
  session:      "mbh-session",
} as const;

// ─── Query Keys (React Query) ─────────────────────────────────────────────────
export const QUERY_KEYS = {
  bundles:      ["bundles"],
  bundle:       (slug: string) => ["bundles", slug],
  featured:     ["bundles", "featured"],
  categories:   ["categories"],
  orders:       ["orders"],
  order:        (id: string) => ["orders", id],
  user:         ["user"],
  referrals:    ["referrals"],
} as const;

// ─── Validation Limits ────────────────────────────────────────────────────────
export const LIMITS = {
  reviewMaxLength:  1000,
  reviewMinLength:  10,
  nameMaxLength:    50,
  descMaxLength:    500,
  searchMaxLength:  100,
  maxCartItems:     5,
} as const;

// ─── Currency ─────────────────────────────────────────────────────────────────
export const CURRENCY = {
  default:  "USD",
  locale:   "en-US",
  symbol:   "$",
} as const;

// ─── Social Links ─────────────────────────────────────────────────────────────
export const SOCIAL = {
  twitter:   "https://twitter.com/mysterybundlehub",
  instagram: "https://instagram.com/mysterybundlehub",
  discord:   "https://discord.gg/mysterybundlehub",
  github:    "https://github.com/mysterybundlehub",
} as const;

// ─── Brand ────────────────────────────────────────────────────────────────────
export const BRAND = {
  name:         "Mystery Bundle Hub",
  shortName:    "MBH",
  tagline:      "Unlock the Unexpected",
  primaryColor: "#18C964",
  email:        "hello@mysterybundlehub.com",
  supportEmail: "support@mysterybundlehub.com",
} as const;
