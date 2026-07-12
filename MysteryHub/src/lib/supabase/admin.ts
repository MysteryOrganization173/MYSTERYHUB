/**
 * Server-only Supabase client (service role key) — V1 Backend Foundation.
 *
 * This client BYPASSES Row Level Security. It must only be imported from
 * server-side code (Route Handlers, Server Actions, Server Components) —
 * never from a file that gets bundled into the browser.
 *
 * The runtime guard below throws immediately if this module is ever
 * evaluated in a browser context, as a defense-in-depth safety net on top
 * of `SUPABASE_SERVICE_ROLE_KEY` not being a `NEXT_PUBLIC_*` variable.
 *
 * Startup resilience: `createClient` throws synchronously if the URL is
 * missing, and every consumer here (`ordersService`, `profilesService`,
 * `fulfillmentService`) is server-only, so an eager throw at import time
 * used to fail Next's build-time "collecting page data" step for any route
 * that transitively imports this file — even ones a request never
 * actually hits, and even when the feature just isn't configured yet in
 * this environment. We now only construct the real client when
 * `isSupabaseAdminConfigured` is true. When it isn't, this exports a lazy
 * proxy of the same type so existing call sites don't need `| null`
 * checks — strict runtime validation is preserved (any real `.from(...)`
 * call still throws a clear, actionable error), it just happens on first
 * use rather than on import.
 *
 * Current consumers: src/services/orders.ts, src/services/profiles.ts,
 * src/services/fulfillment/fulfillmentService.ts.
 */
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import {
  env,
  serverEnv,
  isSupabaseAdminConfigured,
  getMissingSupabaseAdminVars,
} from "@/config/env";
import type { Database } from "@/types/database";

if (typeof window !== "undefined") {
  throw new Error(
    "supabaseAdminClient must never be imported into client-side code."
  );
}

if (!isSupabaseAdminConfigured && env.isDev) {
  console.warn(
    `[MysteryHub] Supabase admin client is not configured — missing ${getMissingSupabaseAdminVars().join(
      ", "
    )}. Server-side database access (orders, profiles, fulfillment) will fail with a clear error until these are set in .env.local; unrelated pages/routes are unaffected.`
  );
}

function createUnconfiguredAdminClient(): SupabaseClient<Database> {
  const missing = getMissingSupabaseAdminVars().join(", ");
  return new Proxy({} as SupabaseClient<Database>, {
    get() {
      throw new Error(
        `Supabase admin client is not configured (missing: ${missing}). Set these in .env.local to enable server-side database access.`
      );
    },
  });
}

export const supabaseAdminClient: SupabaseClient<Database> =
  isSupabaseAdminConfigured
    ? createClient<Database>(env.supabaseUrl, serverEnv.supabaseServiceRoleKey, {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      })
    : createUnconfiguredAdminClient();
