/**
 * Profiles Service — V1 Backend Foundation, extended in V1.5 with admin
 * listing/counting and self-service profile edits.
 *
 * Server-only (imports the service-role admin client). The `profiles`
 * table is auto-populated by a DB trigger whenever a row is inserted into
 * `auth.users` (see supabase/migrations/0001_init_profiles_and_orders.sql
 * and 0003_wallet_referrals_suppliers.sql for the referral-aware version).
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

  /** Updates the only profile field a user can self-edit today. Any
   * additional field (avatar, phone, notification prefs, etc.) has no
   * backing column yet — see docs/product-audit.md rather than faking a
   * save that doesn't persist. */
  async updateFullName(
    userId: string,
    fullName: string
  ): Promise<ApiResponse<Profile>> {
    const trimmed = fullName.trim();
    if (trimmed.length < 2) {
      return { data: null, error: "Name must be at least 2 characters" };
    }

    const { data, error } = await supabaseAdminClient
      .from("profiles")
      .update({ full_name: trimmed })
      .eq("id", userId)
      .select()
      .single();

    if (error || !data) {
      return { data: null, error: error?.message ?? "Failed to update profile" };
    }
    return { data: mapProfileRow(data), error: null };
  },

  /** Admin-only: lists every profile, newest first. Callers are
   * responsible for the admin check — this service has no concept of
   * roles (see docs/authentication.md). */
  async listProfiles(limit = 200): Promise<ApiResponse<Profile[]>> {
    const { data, error } = await supabaseAdminClient
      .from("profiles")
      .select()
      .order("created_at", { ascending: false })
      .limit(limit);

    if (error) {
      return { data: null, error: error.message };
    }
    return { data: (data ?? []).map(mapProfileRow), error: null };
  },

  /** Admin-only: total registered user count. */
  async countProfiles(): Promise<ApiResponse<number>> {
    const { count, error } = await supabaseAdminClient
      .from("profiles")
      .select("id", { count: "exact", head: true });

    if (error) {
      return { data: null, error: error.message };
    }
    return { data: count ?? 0, error: null };
  },

  /** Resolves a referrer's profile by their referral code — used at
   * signup time inside the `handle_new_user()` trigger, and by
   * `ReferralCapture` for a "You were invited by X" banner. Returns
   * `{ data: null, error: null }` (not an error) when the code doesn't
   * match anyone — an invalid/stale referral link should never block
   * signup. */
  async getProfileByReferralCode(
    code: string
  ): Promise<ApiResponse<Pick<Profile, "id" | "fullName"> | null>> {
    const { data, error } = await supabaseAdminClient
      .from("profiles")
      .select("id, full_name")
      .eq("referral_code", code.trim().toUpperCase())
      .maybeSingle();

    if (error) {
      return { data: null, error: error.message };
    }
    if (!data) {
      return { data: null, error: null };
    }
    return { data: { id: data.id, fullName: data.full_name }, error: null };
  },
};
