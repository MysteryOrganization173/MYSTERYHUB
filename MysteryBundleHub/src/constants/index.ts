// ============================================================
// App-Wide Constants — Mystery Hub
// No magic strings/numbers anywhere else in the codebase.
// ============================================================

// ─── Routes ──────────────────────────────────────────────────────────────────
export const ROUTES = {
  home:        "/",
  // Primary nav
  buy:         "/buy",
  earn:        "/earn",
  wallet:      "/wallet",
  dashboard:   "/dashboard",
  support:     "/support",
  // Marketplace & tools
  marketplace: "/marketplace",
  business:    "/business",
  agent:       "/agent",
  referrals:   "/referrals",
  track:       "/track",
  faq:         "/faq",
  // Auth
  signIn:      "/sign-in",
  signUp:      "/sign-up",
  forgotPassword: "/forgot-password",
  // Dashboard sub-routes
  dashboardOrders:    "/dashboard/orders",
  dashboardProfile:   "/dashboard/profile",
  dashboardReferrals: "/dashboard/referrals",
  dashboardWallet:    "/dashboard/wallet",
  // Legal
  privacy:  "/privacy",
  terms:    "/terms",
  cookies:  "/cookies",
  // Info
  about:    "/about",
  blog:     "/blog",
  contact:  "/contact",
} as const;

// ─── API Endpoints ────────────────────────────────────────────────────────────
export const API = {
  // Products / listings
  listings:  "/api/listings",
  listing:   (id: string) => `/api/listings/${id}`,
  featured:  "/api/listings/featured",
  categories:"/api/categories",
  // Orders & wallet
  orders:    "/api/orders",
  order:     (id: string) => `/api/orders/${id}`,
  wallet:    "/api/wallet",
  transactions: "/api/transactions",
  // Earn
  earn:      "/api/earn",
  tasks:     "/api/tasks",
  // Referrals
  referrals:    "/api/referrals",
  referralCode: "/api/referrals/code",
  // User
  user:      "/api/user",
  profile:   "/api/user/profile",
  // Checkout
  checkout:      "/api/checkout",
  webhookStripe: "/api/webhooks/stripe",
} as const;

// ─── Pagination ───────────────────────────────────────────────────────────────
export const PAGINATION = {
  defaultPage:    1,
  defaultLimit:   12,
  listingsPerPage:12,
  ordersPerPage:  20,
  tasksPerPage:   20,
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
  theme:         "mh-theme",
  cartItems:     "mh-cart",
  recentViews:   "mh-recent",
  filters:       "mh-filters",
  announcement:  "mh-announcement-dismissed",
} as const;

// ─── Cookie Names ─────────────────────────────────────────────────────────────
export const COOKIES = {
  referralCode: "mh-ref",
  session:      "mh-session",
} as const;

// ─── Query Keys (React Query) ─────────────────────────────────────────────────
export const QUERY_KEYS = {
  listings:   ["listings"],
  listing:    (id: string) => ["listings", id],
  featured:   ["listings", "featured"],
  categories: ["categories"],
  orders:     ["orders"],
  order:      (id: string) => ["orders", id],
  wallet:     ["wallet"],
  user:       ["user"],
  referrals:  ["referrals"],
  tasks:      ["tasks"],
} as const;

// ─── Validation Limits ────────────────────────────────────────────────────────
export const LIMITS = {
  reviewMaxLength:  1000,
  reviewMinLength:  10,
  nameMaxLength:    50,
  descMaxLength:    500,
  searchMaxLength:  100,
} as const;

// ─── Currency ─────────────────────────────────────────────────────────────────
export const CURRENCY = {
  default: "USD",
  locale:  "en-US",
  symbol:  "$",
} as const;

// ─── Social Links ─────────────────────────────────────────────────────────────
export const SOCIAL = {
  twitter:   "https://twitter.com/mysteryhub",
  instagram: "https://instagram.com/mysteryhub",
  discord:   "https://discord.gg/mysteryhub",
  telegram:  "https://t.me/mysteryhub",
} as const;

// ─── Brand ────────────────────────────────────────────────────────────────────
export const BRAND = {
  name:         "Mystery Hub",
  shortName:    "MH",
  tagline:      "Everything Digital. One Trusted Place.",
  primaryColor: "#18C964",
  email:        "hello@mysteryhub.com",
  supportEmail: "support@mysteryhub.com",
} as const;

// ─── Z-Index Scale ────────────────────────────────────────────────────────────
export const Z = {
  base:       0,
  raised:     10,
  dropdown:   20,
  sticky:     30,
  overlay:    40,
  modal:      50,
  toast:      60,
  tooltip:    70,
} as const;
