/**
 * Catalogue Layer — shared types.
 *
 * `CatalogueSource` is the pluggable provider contract. Today only
 * `mockCatalogueSource.ts` implements it (backed by `src/data/bundles.ts`).
 * When SuccessBizHub is ready, add `successBizHubCatalogueSource.ts`
 * implementing the same interface and swap it in `catalogueService.ts` —
 * no other file in this folder or in `BuyFlow.tsx` needs to change.
 */
import type { DataBundle, NetworkId, NetworkOption } from "@/types/bundle";

/** Mystery Hub's target-market currency. Single source of truth for the
 * catalogue layer — see docs/catalogue.md for the currency decision. */
export const CATALOGUE_CURRENCY = "GHS" as const;

/** Shape a `CatalogueSource` hands back, before the currency + tier mappers
 * normalize it into the domain `DataBundle` used by components. Omits
 * `currency` because that is always attached by the catalogue layer itself,
 * not trusted from a raw provider payload. */
export type RawCatalogueBundle = Omit<DataBundle, "currency">;

/** Raw network shape from a `CatalogueSource`. Identical to `NetworkOption`
 * today because the mock source already returns domain-shaped data; kept as
 * a distinct alias so `networkMapper.ts` has a real mapping seam once a
 * provider with a different wire shape (e.g. SuccessBizHub) is added. */
export type RawCatalogueNetwork = NetworkOption;

export interface CatalogueSource {
  fetchNetworks(): Promise<RawCatalogueNetwork[]>;
  fetchBundles(networkId: NetworkId): Promise<RawCatalogueBundle[]>;
}

// ─── Future admin override support ────────────────────────────────────────
//
// No admin UI exists yet. These types + read hooks are wired into
// `catalogueService` now so a future admin panel only needs to make
// `getAdminBundleOverrides` / `getAdminNetworkOverrides` read from a real
// store (e.g. Supabase table) — `catalogueService` itself won't change.

export interface AdminBundleOverride {
  bundleId: string;
  priceOverride?: number;
  availableOverride?: boolean;
}

export interface AdminNetworkOverride {
  networkId: NetworkId;
  availableOverride?: boolean;
}

/** Returns bundle-level admin overrides. Always empty today. */
export function getAdminBundleOverrides(): AdminBundleOverride[] {
  return [];
}

/** Returns network-level admin overrides. Always empty today. */
export function getAdminNetworkOverrides(): AdminNetworkOverride[] {
  return [];
}
