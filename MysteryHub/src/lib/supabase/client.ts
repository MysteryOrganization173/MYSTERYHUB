/**
 * Browser Supabase client (anon key) — V1 Backend Foundation.
 *
 * Safe to import from client components; uses only the public anon key,
 * which is subject to Row Level Security policies (see
 * supabase/migrations/0001_init_profiles_and_orders.sql).
 *
 * Not yet used by any page or component — this is connection scaffolding.
 * The first real consumer will be the auth UI (sign-in/sign-up), which is
 * explicitly out of scope for this phase.
 */
import { createClient } from "@supabase/supabase-js";
import { env } from "@/config/env";
import type { Database } from "@/types/database";

export const supabaseBrowserClient = createClient<Database>(
  env.supabaseUrl,
  env.supabaseAnonKey
);
