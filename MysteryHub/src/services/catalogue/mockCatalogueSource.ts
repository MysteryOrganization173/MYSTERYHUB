/**
 * Catalogue Layer — mock source.
 *
 * The only `CatalogueSource` implementation today. Wraps the existing
 * hardcoded catalog in `src/data/bundles.ts` behind the same interface a
 * real SuccessBizHub source will implement, so `catalogueService` (and
 * everything above it) never has to change when the real API is wired up —
 * only the `source` assignment in `catalogueService.ts` changes.
 */
import { NETWORK_OPTIONS, getBundlesByNetwork } from "@/data/bundles";
import type { NetworkId } from "@/types/bundle";
import type { CatalogueSource } from "./types";

const mockDelay = (ms: number) =>
  new Promise<void>((resolve) => setTimeout(resolve, ms));

export const mockCatalogueSource: CatalogueSource = {
  async fetchNetworks() {
    await mockDelay(150);
    return NETWORK_OPTIONS;
  },

  async fetchBundles(networkId: NetworkId) {
    await mockDelay(200);
    return getBundlesByNetwork(networkId);
  },
};
