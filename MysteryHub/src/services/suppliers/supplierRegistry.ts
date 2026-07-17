/**
 * Supplier Registry — V1.5 "supplier switching architecture".
 *
 * Single place that turns `public.supplier_settings` (admin-editable
 * enabled/priority) into an actual, callable `CatalogueSource` /
 * `SupplierAdapter` instance. Replaces the old hardcoded
 * `const source = mockCatalogueSource` / `const adapter = mockSupplierAdapter`
 * single-line swap points in `catalogueService.ts` and
 * `fulfillmentService.ts`.
 *
 * Exactly two suppliers are registered for real:
 *   - `successbizhub` — the live adapter (only actually used when
 *     `isSuccessBizHubConfigured` is also true; otherwise treated as
 *     unavailable even if `enabled` in the DB, so a half-configured
 *     environment fails safe rather than throwing on every request).
 *   - `mock` — explicitly labeled "Mock / Test adapter" everywhere it
 *     appears (see supabase/migrations/0003_..., src/app/admin/suppliers).
 *     Never presented as a second live supplier.
 *
 * Settings are cached in-memory for a short TTL to avoid a DB round trip
 * on every single catalogue/fulfillment call — mirrors the pattern
 * already used by `src/services/catalogue/cache.ts`.
 */
import { supplierSettingsService } from "./supplierSettingsService";
import { isSuccessBizHubConfigured } from "@/config/env";
import type { SupplierHealth, SupplierKey, SupplierSetting } from "@/types/supplier";
import type { CatalogueSource } from "@/services/catalogue/types";
import type { SupplierAdapter } from "@/services/fulfillment/supplierAdapter";
import { mockCatalogueSource } from "@/services/catalogue/mockCatalogueSource";
import { mockSupplierAdapter } from "@/services/fulfillment/mockSupplierAdapter";
import { successBizHubCatalogueAdapter } from "./successBizHub/catalogueAdapter";
import { successBizHubFulfillmentAdapter } from "./successBizHub/fulfillmentAdapter";

const SETTINGS_TTL_MS = 30_000;
let cachedSettings: SupplierSetting[] | null = null;
let cachedAt = 0;

async function getSettings(): Promise<SupplierSetting[]> {
  const isFresh = cachedSettings && Date.now() - cachedAt < SETTINGS_TTL_MS;
  if (isFresh && cachedSettings) return cachedSettings;

  const { data } = await supplierSettingsService.listSettings();
  if (data) {
    cachedSettings = data;
    cachedAt = Date.now();
    return data;
  }
  // DB unreachable / table missing (e.g. migration 0003 not yet applied) —
  // fail safe to an all-mock, all-disabled view rather than throwing, so
  // the rest of the app keeps working with the honest mock catalogue.
  return [];
}

/** Invalidate the in-memory settings cache — call after an admin
 * enable/disable/priority change so the next request reflects it
 * immediately instead of waiting out the TTL. */
export function invalidateSupplierSettingsCache(): void {
  cachedSettings = null;
}

/** True only when a supplier is both enabled in the DB AND has its
 * required env vars present. This double gate is what makes "enabling"
 * SuccessBizHub in the admin UI safe even before real credentials exist —
 * it will simply stay unavailable, not error. */
function isReallyAvailable(key: SupplierKey, settings: SupplierSetting[]): boolean {
  const setting = settings.find((s) => s.supplierKey === key);
  if (!setting?.enabled) return false;
  if (key === "successbizhub") return isSuccessBizHubConfigured;
  return true; // "mock" has no external config requirement
}

function sortedByPriority(settings: SupplierSetting[]): SupplierSetting[] {
  return [...settings].sort((a, b) => a.priority - b.priority);
}

export const supplierRegistry = {
  /** Picks the active `CatalogueSource`: the highest-priority (lowest
   * `priority` number) supplier that is enabled + configured. Always
   * falls back to `mockCatalogueSource` if nothing qualifies. */
  async getActiveCatalogueSource(): Promise<CatalogueSource> {
    const settings = await getSettings();
    for (const setting of sortedByPriority(settings)) {
      const key = setting.supplierKey as SupplierKey;
      if (!isReallyAvailable(key, settings)) continue;
      if (key === "successbizhub") return successBizHubCatalogueAdapter;
      if (key === "mock") return mockCatalogueSource;
    }
    return mockCatalogueSource;
  },

  /** Picks the active `SupplierAdapter` for fulfillment, same priority
   * rule as `getActiveCatalogueSource`. */
  async getActiveFulfillmentAdapter(): Promise<SupplierAdapter> {
    const settings = await getSettings();
    for (const setting of sortedByPriority(settings)) {
      const key = setting.supplierKey as SupplierKey;
      if (!isReallyAvailable(key, settings)) continue;
      if (key === "successbizhub") return successBizHubFulfillmentAdapter;
      if (key === "mock") return mockSupplierAdapter;
    }
    return mockSupplierAdapter;
  },

  /** Read-only health snapshot for the admin suppliers page — configured
   * flags only, never secrets. */
  async listHealth(): Promise<SupplierHealth[]> {
    return [
      { supplierKey: "successbizhub", configured: isSuccessBizHubConfigured },
      { supplierKey: "mock", configured: true },
    ];
  },
};
