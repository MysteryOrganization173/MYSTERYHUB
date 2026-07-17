/**
 * Supplier settings domain types — V1.5 Product Transformation
 * ("supplier switching architecture", see docs/product-audit.md Phase 4).
 *
 * Backed by `public.supplier_settings` — routing metadata only, NEVER
 * secrets (those stay in env vars, see `src/config/env.ts`). Read by
 * `src/services/suppliers/supplierRegistry.ts` to pick the active
 * catalogue/fulfillment adapter; written by the admin
 * `/api/admin/suppliers` route.
 */
import type { Database } from "./database";

export type SupplierSettingRow =
  Database["public"]["Tables"]["supplier_settings"]["Row"];

export interface SupplierSetting {
  supplierKey: string;
  label: string;
  enabled: boolean;
  priority: number;
  updatedAt: string;
}

export function mapSupplierSettingRow(
  row: SupplierSettingRow
): SupplierSetting {
  return {
    supplierKey: row.supplier_key,
    label: row.label,
    enabled: row.enabled,
    priority: row.priority,
    updatedAt: row.updated_at,
  };
}

/** Every supplier adapter this codebase can register, real or mock. Kept
 * as a literal union (not an arbitrary string) so `supplierRegistry.ts`'s
 * switch statement is exhaustive-checked by the compiler. */
export type SupplierKey = "successbizhub" | "mock";

export interface SupplierHealth {
  supplierKey: SupplierKey;
  /** True when the required env vars for this supplier are present. Does
   * NOT mean the supplier is reachable right now — only that it's
   * configured. A real reachability probe is a heavier operation this
   * V1.5 pass intentionally does not add (see docs/product-audit.md). */
  configured: boolean;
}
