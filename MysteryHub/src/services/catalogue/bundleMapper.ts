/**
 * Catalogue Layer — bundle mapper.
 *
 * Normalizes a raw provider bundle into the domain `DataBundle` used by
 * components: resolves the tier via `tierMapper` and attaches the
 * catalogue's single currency (GHS). Supersedes the ad-hoc `mapBundle` that
 * previously lived inline in `dataBundlesService`.
 */
import type { DataBundle } from "@/types/bundle";
import { CATALOGUE_CURRENCY, type RawCatalogueBundle } from "./types";
import { resolveTier } from "./tierMapper";

export function mapBundle(raw: RawCatalogueBundle): DataBundle {
  return {
    id: raw.id,
    network: raw.network,
    tier: resolveTier(raw.tier, raw.network),
    name: raw.name,
    volume: raw.volume,
    volumeGB: raw.volumeGB,
    price: raw.price,
    currency: CATALOGUE_CURRENCY,
    deliveryTime: raw.deliveryTime,
    shieldProtection: raw.shieldProtection,
    available: raw.available,
    description: raw.description,
    popular: raw.popular,
    bestValue: raw.bestValue,
  };
}
