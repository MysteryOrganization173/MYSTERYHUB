/**
 * Supplier Catalogue Service — server-only orchestrator.
 *
 * Sits between the new `/api/catalogue/*` route handlers and
 * `supplierRegistry.ts`. Exists as its own file (rather than folding this
 * logic into the route handlers directly) so both routes share one
 * fallback policy: if the registry's active adapter throws (SuccessBizHub
 * unreachable, malformed response, etc.), log a warning and serve the
 * honest mock catalogue instead of a 502 — a temporary supplier outage
 * should not take internet-package browsing down entirely. Never
 * fabricates supplier data; the fallback is always the same static mock
 * data used everywhere else in this codebase's "no live supplier
 * configured" state.
 */
import { supplierRegistry } from "@/services/suppliers/supplierRegistry";
import { mockCatalogueSource } from "@/services/catalogue/mockCatalogueSource";
import { getMockBundlesForNetwork } from "@/services/suppliers/successBizHub/catalogueAdapter";
import { NETWORK_OPTIONS } from "@/data/bundles";
import type { NetworkId } from "@/types/bundle";
import type { RawCatalogueBundle, RawCatalogueNetwork } from "./types";

export const supplierCatalogueService = {
  async fetchNetworks(): Promise<RawCatalogueNetwork[]> {
    return NETWORK_OPTIONS;
  },

  async fetchBundles(networkId: NetworkId): Promise<RawCatalogueBundle[]> {
    const source = await supplierRegistry.getActiveCatalogueSource();

    if (source === mockCatalogueSource) {
      return source.fetchBundles(networkId);
    }

    try {
      return await source.fetchBundles(networkId);
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      console.warn(
        `[MysteryHub] Active catalogue supplier failed for ${networkId} (${message}) — falling back to the mock catalogue.`
      );
      return getMockBundlesForNetwork(networkId);
    }
  },
};
