/**
 * SuccessBizHub Catalogue Adapter — implements `CatalogueSource`.
 *
 * Networks are a static, curated list (MTN Express, MTN Budget,
 * AirtelTigo, Telecel) regardless of supplier — SuccessBizHub does not
 * need to be reachable just to know which networks Mystery Hub supports.
 * Only `fetchBundles()` makes a real outbound call. See `client.ts` for
 * why the wire shape below is a defensive best-effort, not a confirmed
 * contract.
 *
 * Never fabricates bundle data on failure — throws, so
 * `supplierCatalogueService.ts` can fall back to the honest mock
 * catalogue and log a warning, exactly like a "temporarily unavailable"
 * state anywhere else in this codebase.
 */
import type { CatalogueSource, RawCatalogueBundle } from "@/services/catalogue/types";
import type { NetworkId } from "@/types/bundle";
import { NETWORK_OPTIONS, getBundlesByNetwork } from "@/data/bundles";
import { successBizHubRequest } from "./client";

/** Percentage markup applied over SuccessBizHub's supplier price — a
 * placeholder business decision (matches the existing mock catalogue's
 * pricing shape), not a confirmed supplier price list. */
const MARKUP_PERCENT = 10;

interface SuccessBizHubBundleDto {
  bundle_id: string;
  network: string;
  capacity_mb: number;
  price: string | number;
  delivery_minutes?: number;
  active?: boolean;
  description?: string;
}

function applyMarkup(supplierPrice: number): number {
  const marked = supplierPrice * (1 + MARKUP_PERCENT / 100);
  // Round up to the nearest 0.10 GHS — clean, predictable retail pricing.
  return Math.ceil(marked * 10) / 10;
}

function mapDto(dto: SuccessBizHubBundleDto, networkId: NetworkId): RawCatalogueBundle {
  const volumeGB = Number((dto.capacity_mb / 1024).toFixed(2));
  const supplierPrice = Number(dto.price);
  return {
    id: dto.bundle_id,
    network: networkId,
    tier: "standard",
    name: dto.description ?? `${volumeGB}GB Package`,
    volume: `${volumeGB}GB`,
    volumeGB,
    price: applyMarkup(supplierPrice),
    deliveryTime: dto.delivery_minutes ? `< ${dto.delivery_minutes} min` : "< 5 min",
    shieldProtection: true,
    available: dto.active ?? true,
    description: dto.description ?? "",
  };
}

export const successBizHubCatalogueAdapter: CatalogueSource = {
  async fetchNetworks() {
    return NETWORK_OPTIONS;
  },

  async fetchBundles(networkId: NetworkId): Promise<RawCatalogueBundle[]> {
    const { data, error } = await successBizHubRequest<SuccessBizHubBundleDto[]>({
      method: "GET",
      path: `/bundles?network=${encodeURIComponent(networkId)}`,
    });

    if (error || !data) {
      throw new Error(error ?? "SuccessBizHub returned no bundle data");
    }
    if (!Array.isArray(data) || data.length === 0) {
      // An empty/malformed response is treated the same as an error by
      // the caller (supplierCatalogueService) — fall back to mock rather
      // than show an empty catalogue for a network that should have
      // packages.
      throw new Error("SuccessBizHub returned an empty bundle list");
    }

    return data.map((dto) => mapDto(dto, networkId));
  },
};

/** Exposed for `supplierCatalogueService.ts`'s fallback path — reuses the
 * exact same mock data every other honest-fallback code path in this
 * codebase already uses. */
export function getMockBundlesForNetwork(networkId: NetworkId): RawCatalogueBundle[] {
  return getBundlesByNetwork(networkId);
}
