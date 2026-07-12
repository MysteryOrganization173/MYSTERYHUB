/**
 * Catalogue Layer — network mapper.
 *
 * Normalizes a raw provider network into the domain `NetworkOption` used by
 * components. Trivial today because `mockCatalogueSource` already returns
 * domain-shaped data; kept as an explicit mapping seam so a future
 * SuccessBizHub source (with a different wire shape) only needs to change
 * this function, not any component.
 */
import type { NetworkOption } from "@/types/bundle";
import type { RawCatalogueNetwork } from "./types";

export function mapNetwork(raw: RawCatalogueNetwork): NetworkOption {
  return {
    id: raw.id,
    name: raw.name,
    shortName: raw.shortName,
    color: raw.color,
    description: raw.description,
    available: raw.available,
  };
}
