/**
 * Browser Supabase client (anon key) — V1 Backend Foundation.
 *
 * Safe to import from client components; uses only the public anon key,
 * which is subject to Row Level Security policies (see
 * supabase/migrations/0001_init_profiles_and_orders.sql).
 *
 * Startup resilience: `@supabase/supabase-js`'s `createClient` throws
 * synchronously (e.g. "supabaseUrl is required.") if the URL/key are
 * missing or empty. Since this module is imported transitively from
 * `AppProviders` (via `AuthProvider` -> `authService`), an eager throw here
 * used to crash EVERY page, not just auth-related ones. We now only
 * construct the real client when `isSupabaseConfigured` is true; otherwise
 * this exports `null` and logs a clear one-time warning in development.
 * `authService` (the only consumer) treats a `null` client as "auth
 * disabled" and returns a friendly `ApiResponse` error instead of throwing,
 * so the rest of the site (homepage, buy flow, marketplace, etc.) keeps
 * working normally.
 */
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { env, isSupabaseConfigured, getMissingSupabaseClientVars } from "@/config/env";
import type { Database } from "@/types/database";

if (!isSupabaseConfigured && env.isDev) {
  console.warn(
    `[MysteryHub] Supabase browser client is not configured — missing ${getMissingSupabaseClientVars().join(
      ", "
    )}. Auth features (sign in / sign up / sessions) are disabled until these are set in .env.local; the rest of the site will continue to work normally.`
  );
}

export const supabaseBrowserClient: SupabaseClient<Database> | null =
  isSupabaseConfigured
    ? createClient<Database>(env.supabaseUrl, env.supabaseAnonKey)
    : null;
