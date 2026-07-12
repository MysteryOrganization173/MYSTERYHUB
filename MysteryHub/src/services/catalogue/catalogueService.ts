/**
 * Catalogue Service — Mystery Hub
 *
 * Production-ready replacement for the previous hardcoded-catalog access
 * pattern (`BuyFlow` importing `src/data/bundles.ts` directly). Designed so
 * the eventual SuccessBizHub integration is a one-line source swap below,
 * not a rewrite of this file or of any component.
 *
 * Responsibilities:
 *   - Fetch raw catalogue data from the active `CatalogueSource`
 *   - Map raw data to domain types (`networkMapper` / `bundleMapper`)
 *   - Cache results (`CatalogueCache`) to avoid refetching on every render
 *   - Apply admin overrides (no-op today, hook point for later)
 *   - Never throw — always return `ApiResponse<T>`, matching every other
 *     service in this codebase (`apiClient`, `ordersService`, `authService`)
 *
 * See docs/catalogue.md for the full architecture writeup.
 */
import type { ApiResponse } from "@/types";
import type { DataBundle, NetworkId, NetworkOption } from "@/types/bundle";
import { CatalogueCache } from "./cache";
import { mapNetwork } from "./networkMapper";
import { mapBundle } from "./bundleMapper";
import { mockCatalogueSource } from "./mockCatalogueSource";
import {
  getAdminBundleOverrides,
  getAdminNetworkOverrides,
  type CatalogueSource,
} from "./types";

// ─── Single swap point for SuccessBizHub ──────────────────────────────────
// When the real API is ready: create `successBizHubCatalogueSource.ts`
// implementing `CatalogueSource`, then change only the line below.
const source: CatalogueSource = mockCatalogueSource;

// ─── Cache ─────────────────────────────────────────────────────────────────
const networksCache = new CatalogueCache<NetworkOption[]>();
const bundlesCache = new CatalogueCache<DataBundle[]>();

const NETWORKS_KEY = "networks";
const bundlesKey = (networkId: NetworkId) => `bundles:${networkId}`;

// ─── Loading state ─────────────────────────────────────────────────────────
// Tracked as an in-flight request counter rather than a subscribable store —
// consistent with the rest of the app not yet using React Query/Zustand
// (per docs/ROADMAP.md). Callers own their own per-component loading UI;
// `isLoading()` is available for any shared/global loading indicator.
let pendingRequests = 0;

function withLoadingTracked<T>(fn: () => Promise<T>): Promise<T> {
  pendingRequests++;
  return fn().finally(() => {
    pendingRequests--;
  });
}

// ─── Admin overrides (future support, no-op today) ────────────────────────
function applyNetworkOverrides(networks: NetworkOption[]): NetworkOption[] {
  const overrides = getAdminNetworkOverrides();
  if (overrides.length === 0) return networks;
  return networks.map((network) => {
    const override = overrides.find((o) => o.networkId === network.id);
    if (!override) return network;
    return {
      ...network,
      available: override.availableOverride ?? network.available,
    };
  });
}

function applyBundleOverrides(bundles: DataBundle[]): DataBundle[] {
  const overrides = getAdminBundleOverrides();
  if (overrides.length === 0) return bundles;
  return bundles.map((bundle) => {
    const override = overrides.find((o) => o.bundleId === bundle.id);
    if (!override) return bundle;
    return {
      ...bundle,
      price: override.priceOverride ?? bundle.price,
      available: override.availableOverride ?? bundle.available,
    };
  });
}

function toErrorMessage(err: unknown, fallback: string): string {
  return err instanceof Error ? err.message : fallback;
}

export const catalogueService = {
  /** True while at least one catalogue fetch is in flight. */
  isLoading(): boolean {
    return pendingRequests > 0;
  },

  /** Returns all networks (mapped + cached). Pass `forceRefresh` to bypass
   * the cache — used by `refresh()` consumers such as a future
   * pull-to-refresh control. */
  async getNetworks(
    { forceRefresh = false }: { forceRefresh?: boolean } = {}
  ): Promise<ApiResponse<NetworkOption[]>> {
    if (!forceRefresh) {
      const cached = networksCache.get(NETWORKS_KEY);
      if (cached) return { data: applyNetworkOverrides(cached), error: null };
    }

    try {
      const mapped = await withLoadingTracked(async () => {
        const raw = await source.fetchNetworks();
        return raw.map(mapNetwork);
      });
      networksCache.set(NETWORKS_KEY, mapped);
      return { data: applyNetworkOverrides(mapped), error: null };
    } catch (err) {
      return { data: null, error: toErrorMessage(err, "Failed to load networks") };
    }
  },

  /** Returns bundles for a single network (mapped + cached per network). */
  async getBundles(
    networkId: NetworkId,
    { forceRefresh = false }: { forceRefresh?: boolean } = {}
  ): Promise<ApiResponse<DataBundle[]>> {
    const key = bundlesKey(networkId);

    if (!forceRefresh) {
      const cached = bundlesCache.get(key);
      if (cached) return { data: applyBundleOverrides(cached), error: null };
    }

    try {
      const mapped = await withLoadingTracked(async () => {
        const raw = await source.fetchBundles(networkId);
        return raw.map(mapBundle);
      });
      bundlesCache.set(key, mapped);
      return { data: applyBundleOverrides(mapped), error: null };
    } catch (err) {
      return { data: null, error: toErrorMessage(err, "Failed to load bundles") };
    }
  },

  /** Convenience lookup for a single bundle within a known network. */
  async getBundle(
    bundleId: string,
    networkId: NetworkId
  ): Promise<ApiResponse<DataBundle | null>> {
    const { data, error } = await this.getBundles(networkId);
    if (error) return { data: null, error };
    return { data: data?.find((b) => b.id === bundleId) ?? null, error: null };
  },

  /** Invalidates all cached catalogue data. Call after an admin override
   * changes pricing/availability, or from a future pull-to-refresh action —
   * the next `getNetworks`/`getBundles` call will re-fetch from `source`. */
  refresh(): void {
    networksCache.invalidate();
    bundlesCache.invalidate();
  },
};
