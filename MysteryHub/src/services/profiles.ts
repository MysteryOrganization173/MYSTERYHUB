/**
 * Profiles Service — V1 Backend Foundation.
 *
 * Server-only (imports the service-role admin client). Minimal read access
 * to the `profiles` table, which is auto-populated by a DB trigger whenever
 * a row is inserted into `auth.users` (see
 * supabase/migrations/0001_init_profiles_and_orders.sql).
 *
 * No auth UI consumes this yet. It exists so order-to-user linkage
 * (`orders.user_id`) has a corresponding read path once sign-in/sign-up
 * ships in a later phase.
 */
import { supabaseAdminClient } from "@/lib/supabase/admin";
import { mapProfileRow, type Profile } from "@/types/profile";
import type { ApiResponse } from "@/types";

export const profilesService = {
  async getProfile(userId: string): Promise<ApiResponse<Profile>> {
    const { data, error } = await supabaseAdminClient
      .from("profiles")
      .select()
      .eq("id", userId)
      .maybeSingle();

    if (error) {
      return { data: null, error: error.message };
    }
    if (!data) {
      return { data: null, error: "Profile not found" };
    }
    return { data: mapProfileRow(data), error: null };
  },
};
