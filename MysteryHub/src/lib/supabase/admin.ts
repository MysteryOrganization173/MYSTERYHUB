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
 * Current consumers: src/services/orders.ts, src/services/profiles.ts.
 */
import { createClient } from "@supabase/supabase-js";
import { env, serverEnv } from "@/config/env";
import type { Database } from "@/types/database";

if (typeof window !== "undefined") {
  throw new Error(
    "supabaseAdminClient must never be imported into client-side code."
  );
}

export const supabaseAdminClient = createClient<Database>(
  env.supabaseUrl,
  serverEnv.supabaseServiceRoleKey,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
);
