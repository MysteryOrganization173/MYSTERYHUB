/**
 * API CatalogueSource — implements `CatalogueSource` by calling this app's
 * own `/api/catalogue/*` routes.
 *
 * This is the swap that replaced `mockCatalogueSource` as
 * `catalogueService.ts`'s active source in V1.5. It exists so
 * `catalogueService` (imported directly by client components such as
 * `BuyFlow.tsx`) never has to know whether the real catalogue is backed
 * by SuccessBizHub or the mock fallback, and — critically — never needs a
 * supplier API key in the browser bundle. The actual supplier selection
 * happens server-side in `supplierCatalogueService.ts` /
 * `supplierRegistry.ts`, reached only through these routes.
 *
 * Safe to run in either the browser or on the server (plain `fetch`
 * against a relative/absolute URL, same pattern as `src/services/api.ts`).
 */
import type { CatalogueSource, RawCatalogueBundle, RawCatalogueNetwork } from "./types";
import type { NetworkId } from "@/types/bundle";

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

async function fetchJson<T>(path: string): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`);
  const json = await res.json().catch(() => null);
  if (!res.ok) {
    throw new Error(json?.error ?? `Catalogue request failed with status ${res.status}`);
  }
  return json as T;
}

export const apiCatalogueSource: CatalogueSource = {
  async fetchNetworks(): Promise<RawCatalogueNetwork[]> {
    return fetchJson<RawCatalogueNetwork[]>("/api/catalogue/networks");
  },

  async fetchBundles(networkId: NetworkId): Promise<RawCatalogueBundle[]> {
    return fetchJson<RawCatalogueBundle[]>(
      `/api/catalogue/bundles/${encodeURIComponent(networkId)}`
    );
  },
};
