/**
 * Environment variable configuration with type safety.
 * Server-side variables should only be imported in server components / API routes.
 * Client-side variables (NEXT_PUBLIC_*) can be used anywhere.
 */

export const env = {
  // App
  appUrl: process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000",
  appName: process.env.NEXT_PUBLIC_APP_NAME ?? "Mystery Hub",
  appDescription:
    process.env.NEXT_PUBLIC_APP_DESCRIPTION ??
    "Digital services platform for connectivity, mobile services, and more",
  nodeEnv: process.env.NODE_ENV ?? "development",
  isDev: process.env.NODE_ENV === "development",
  isProd: process.env.NODE_ENV === "production",

  // Supabase (public)
  supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL ?? "",
  supabaseAnonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "",

  // Stripe (public) — scaffolded only, not wired to anything. Paystack is
  // the live V1 payment rail; see `paystackPublicKey` below and
  // docs/payment-flow.md.
  stripePublishableKey:
    process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ?? "",

  // Paystack (public) — not required by the current server-initialized +
  // popup "resume transaction" flow (see src/lib/paystack/paystackPopup.ts),
  // but kept available for any future client-side Paystack usage.
  paystackPublicKey: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY ?? "",

  // Analytics
  gaId: process.env.NEXT_PUBLIC_GA_ID ?? "",

  // Cloudinary (public) — the cloud name is not a secret (it's part of
  // every delivery URL), so it gets its own NEXT_PUBLIC_ var distinct from
  // `serverEnv.cloudinaryCloudName`. Only used by `BrandImage` to decide
  // whether to render `CldImage` (Cloudinary-hosted) or fall back to the
  // local /public asset — see src/components/shared/BrandImage.tsx.
  cloudinaryCloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME ?? "",

  // Feature flags
  enableReferrals: process.env.NEXT_PUBLIC_ENABLE_REFERRALS === "true",
  enableAffiliates: process.env.NEXT_PUBLIC_ENABLE_AFFILIATES === "true",
  maintenanceMode: process.env.NEXT_PUBLIC_MAINTENANCE_MODE === "true",
} as const;

/** Server-only env vars — DO NOT import in client components */
export const serverEnv = {
  supabaseServiceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY ?? "",
  stripeSecretKey: process.env.STRIPE_SECRET_KEY ?? "",
  stripeWebhookSecret: process.env.STRIPE_WEBHOOK_SECRET ?? "",
  /** Used both to call the Paystack API (Bearer auth) and to verify
   * `x-paystack-signature` on incoming webhooks — Paystack does not use a
   * separate webhook secret, unlike Stripe. */
  paystackSecretKey: process.env.PAYSTACK_SECRET_KEY ?? "",
  resendApiKey: process.env.RESEND_API_KEY ?? "",
  resendFromEmail:
    process.env.RESEND_FROM_EMAIL ?? "noreply@mysterybundlehub.com",

  // SuccessBizHub — the first real supplier adapter (catalogue +
  // fulfillment). See src/services/suppliers/successBizHub/. No public API
  // docs exist for SuccessBizHub (confirmed via web search) — the wire
  // shapes in that folder are written defensively and may need correction
  // once real docs/sandbox access exist; see docs/product-audit.md.
  successBizHubBaseUrl: process.env.SUCCESSBIZHUB_BASE_URL ?? "",
  successBizHubApiKey: process.env.SUCCESSBIZHUB_API_KEY ?? "",
  successBizHubRequestTimeoutMs: Number(
    process.env.SUCCESSBIZHUB_REQUEST_TIMEOUT_MS ?? 8000
  ),

  // Cloudinary — media delivery/uploads. See docs/product-audit.md
  // ("Phase 7 — Visual assets") for what is and isn't wired.
  cloudinaryCloudName: process.env.CLOUDINARY_CLOUD_NAME ?? "",
  cloudinaryApiKey: process.env.CLOUDINARY_API_KEY ?? "",
  cloudinaryApiSecret: process.env.CLOUDINARY_API_SECRET ?? "",

  /** Comma-separated, case-insensitive admin allowlist. Server-only —
   * never sent to the browser. See docs/authentication.md for the full
   * rationale for an env allowlist instead of a `role` column. */
  adminEmails: (process.env.ADMIN_EMAILS ?? "")
    .split(",")
    .map((email) => email.trim().toLowerCase())
    .filter((email) => email.length > 0),
} as const;

export type Env = typeof env;
export type ServerEnv = typeof serverEnv;

/**
 * True once the minimum client-side Supabase credentials are present.
 * Used by src/lib/supabase/client.ts consumers to avoid confusing runtime
 * errors when `.env.local` hasn't been configured yet.
 */
export const isSupabaseConfigured = Boolean(
  env.supabaseUrl && env.supabaseAnonKey
);

/**
 * True once the service-role key is present. Server-only code
 * (src/lib/supabase/admin.ts, src/services/orders.ts,
 * src/services/profiles.ts) can check this before querying.
 */
export const isSupabaseAdminConfigured = Boolean(
  env.supabaseUrl && serverEnv.supabaseServiceRoleKey
);

/** True once `PAYSTACK_SECRET_KEY` is present. Checked by
 * `src/services/payments/paystackClient.ts` before calling Paystack, so a
 * missing key fails with a clear error instead of an opaque fetch failure. */
export const isPaystackConfigured = Boolean(serverEnv.paystackSecretKey);

/**
 * Names of the client-side Supabase env vars that are currently missing —
 * used by `src/lib/supabase/client.ts` to log a precise startup warning
 * instead of letting `@supabase/supabase-js` throw an opaque
 * "supabaseUrl is required" error at module-evaluation time.
 */
export function getMissingSupabaseClientVars(): string[] {
  return [
    !env.supabaseUrl && "NEXT_PUBLIC_SUPABASE_URL",
    !env.supabaseAnonKey && "NEXT_PUBLIC_SUPABASE_ANON_KEY",
  ].filter((v): v is string => Boolean(v));
}

/** Same as `getMissingSupabaseClientVars`, but for the server-only
 * service-role variable checked by `src/lib/supabase/admin.ts`. */
export function getMissingSupabaseAdminVars(): string[] {
  return [
    !env.supabaseUrl && "NEXT_PUBLIC_SUPABASE_URL",
    !serverEnv.supabaseServiceRoleKey && "SUPABASE_SERVICE_ROLE_KEY",
  ].filter((v): v is string => Boolean(v));
}

/** True once both SuccessBizHub env vars are present. Checked by
 * `src/services/suppliers/successBizHub/*` before making a real HTTP call
 * — when false, that adapter reports itself as unconfigured rather than
 * throwing an opaque network error. */
export const isSuccessBizHubConfigured = Boolean(
  serverEnv.successBizHubBaseUrl && serverEnv.successBizHubApiKey
);

/** True once a Cloudinary cloud name is set server-side — enough to
 * *display* already-uploaded assets via
 * `res.cloudinary.com/<cloud_name>/...` (see `next.config.ts`'s
 * `images.remotePatterns`). */
export const isCloudinaryConfigured = Boolean(serverEnv.cloudinaryCloudName);

/** True once `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` is set — the client-side
 * equivalent of `isCloudinaryConfigured`, checked by `BrandImage` (a
 * client component) before rendering `CldImage` instead of a local
 * `next/image` fallback. */
export const isCloudinaryDeliveryConfigured = Boolean(env.cloudinaryCloudName);

/** True once full Cloudinary credentials (cloud name + key + secret) are
 * present — required for uploads, not just delivery. */
export const isCloudinaryUploadConfigured = Boolean(
  serverEnv.cloudinaryCloudName &&
    serverEnv.cloudinaryApiKey &&
    serverEnv.cloudinaryApiSecret
);

/** True once at least one admin email is configured. An unconfigured
 * allowlist fails CLOSED (nobody is an admin), never open — see
 * `isAdminEmail` below and docs/authentication.md. */
export const isAdminAllowlistConfigured = serverEnv.adminEmails.length > 0;

/** Checks a (possibly-null/undefined) email against the `ADMIN_EMAILS`
 * allowlist, case-insensitively. Server-only — never call from a client
 * component. The allowlist itself is never returned to the browser by any
 * route; only this boolean result is (see `GET /api/admin/check`). */
export function isAdminEmail(email: string | null | undefined): boolean {
  if (!email) return false;
  return serverEnv.adminEmails.includes(email.trim().toLowerCase());
}
