/**
 * Supplier Settings Service — V1.5 "supplier switching architecture".
 *
 * Server-only. Reads/writes `public.supplier_settings` — routing metadata
 * only (enabled/priority/label), never credentials. `supplierRegistry.ts`
 * reads this to pick the active catalogue/fulfillment adapter;
 * `/api/admin/suppliers` is the only writer, gated by `isAdminEmail`.
 */
import { supabaseAdminClient } from "@/lib/supabase/admin";
import { mapSupplierSettingRow, type SupplierSetting } from "@/types/supplier";
import type { ApiResponse } from "@/types";

export const supplierSettingsService = {
  async listSettings(): Promise<ApiResponse<SupplierSetting[]>> {
    const { data, error } = await supabaseAdminClient
      .from("supplier_settings")
      .select()
      .order("priority", { ascending: true });

    if (error) {
      return { data: null, error: error.message };
    }
    return { data: (data ?? []).map(mapSupplierSettingRow), error: null };
  },

  async updateSetting(
    supplierKey: string,
    updates: { enabled?: boolean; priority?: number }
  ): Promise<ApiResponse<SupplierSetting>> {
    const { data, error } = await supabaseAdminClient
      .from("supplier_settings")
      .update(updates)
      .eq("supplier_key", supplierKey)
      .select()
      .single();

    if (error || !data) {
      return {
        data: null,
        error: error?.message ?? "Failed to update supplier setting",
      };
    }
    return { data: mapSupplierSettingRow(data), error: null };
  },
};
