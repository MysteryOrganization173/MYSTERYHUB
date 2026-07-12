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

  // Stripe (public)
  stripePublishableKey:
    process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ?? "",

  // Analytics
  gaId: process.env.NEXT_PUBLIC_GA_ID ?? "",

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
  resendApiKey: process.env.RESEND_API_KEY ?? "",
  resendFromEmail:
    process.env.RESEND_FROM_EMAIL ?? "noreply@mysterybundlehub.com",
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
