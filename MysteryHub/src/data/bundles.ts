/**
 * Mock Internet Package Catalog — Mystery Hub
 *
 * Raw provider-shaped catalog data consumed ONLY by
 * `src/services/catalogue/mockCatalogueSource.ts` — the sole
 * `CatalogueSource` implementation today. Components must not import this
 * file directly; go through `catalogueService` instead so the eventual
 * SuccessBizHub source swap requires no component changes.
 *
 * TO INTEGRATE THE REAL API:
 *   Add `successBizHubCatalogueSource.ts` (implementing `CatalogueSource`)
 *   and swap it in `src/services/catalogue/catalogueService.ts`. This file
 *   can then be deleted.
 *
 * Sample catalog pricing (illustrative, GHS):
 *   MTN Express  — 1GB ₵4.99 | 2GB ₵9.99  | 3GB ₵14.99 | 5GB ₵23.99
 *   MTN Budget   — 1GB ₵4.49 | 2GB ₵8.89  | 3GB ₵13.29 | 5GB ₵21.99
 *   AirtelTigo   — 1GB ₵4.79 | 2GB ₵8.99  | 3GB ₵13.49 | 5GB ₵22.49
 *   Telecel      — 10GB ₵44.99 | 15GB ₵63.99 | 20GB ₵83.99
 */

import type { NetworkId, NetworkOption } from "@/types/bundle";
import type { RawCatalogueBundle } from "@/services/catalogue/types";

// ─── Network Options ──────────────────────────────────────────────────────────

export const NETWORK_OPTIONS: NetworkOption[] = [
  {
    id: "mtn-express",
    name: "MTN Express",
    shortName: "MTN",
    color: "#FFD200",
    description: "Fastest delivery. Instant activation.",
    available: true,
  },
  {
    id: "mtn-budget",
    name: "MTN Budget",
    shortName: "MTN",
    color: "#FFA500",
    description: "MTN internet packages for everyday connectivity.",
    available: true,
  },
  {
    id: "airteltigo",
    name: "AirtelTigo",
    shortName: "AT",
    color: "#E30613",
    description: "Great coverage across all regions.",
    available: true,
  },
  {
    id: "telecel",
    name: "Telecel",
    shortName: "TC",
    color: "#CC0000",
    description: "High-capacity packages for power users.",
    available: true,
  },
];

// ─── Internet Packages (mock catalog) ─────────────────────────────────────────

export const DATA_BUNDLES: RawCatalogueBundle[] = [
  // ── MTN Express ────────────────────────────────────────────────────────────
  {
    id: "mtn-express-1gb",
    network: "mtn-express",
    tier: "express",
    name: "MTN Express 1GB",
    volume: "1GB",
    volumeGB: 1,
    price: 4.99,
    deliveryTime: "< 2 min",
    shieldProtection: true,
    available: true,
    description: "Light browsing and social media.",
  },
  {
    id: "mtn-express-2gb",
    network: "mtn-express",
    tier: "express",
    name: "MTN Express 2GB",
    volume: "2GB",
    volumeGB: 2,
    price: 9.99,
    deliveryTime: "< 2 min",
    shieldProtection: true,
    available: true,
    description: "Streaming, video calls, and daily use.",
    popular: true,
  },
  {
    id: "mtn-express-3gb",
    network: "mtn-express",
    tier: "express",
    name: "MTN Express 3GB",
    volume: "3GB",
    volumeGB: 3,
    price: 14.99,
    deliveryTime: "< 2 min",
    shieldProtection: true,
    available: true,
    description: "Solid data for work and entertainment.",
  },
  {
    id: "mtn-express-5gb",
    network: "mtn-express",
    tier: "express",
    name: "MTN Express 5GB",
    volume: "5GB",
    volumeGB: 5,
    price: 23.99,
    deliveryTime: "< 2 min",
    shieldProtection: true,
    available: true,
    description: "Power user plan — never run dry.",
    bestValue: true,
  },

  // ── MTN Budget ─────────────────────────────────────────────────────────────
  {
    id: "mtn-budget-1gb",
    network: "mtn-budget",
    tier: "budget",
    name: "MTN Budget 1GB",
    volume: "1GB",
    volumeGB: 1,
    price: 4.49,
    deliveryTime: "< 5 min",
    shieldProtection: false,
    available: true,
    description: "Budget-friendly connectivity for casual use.",
  },
  {
    id: "mtn-budget-2gb",
    network: "mtn-budget",
    tier: "budget",
    name: "MTN Budget 2GB",
    volume: "2GB",
    volumeGB: 2,
    price: 8.89,
    deliveryTime: "< 5 min",
    shieldProtection: false,
    available: true,
    description: "More capacity for everyday connectivity.",
    popular: true,
  },
  {
    id: "mtn-budget-3gb",
    network: "mtn-budget",
    tier: "budget",
    name: "MTN Budget 3GB",
    volume: "3GB",
    volumeGB: 3,
    price: 13.29,
    deliveryTime: "< 5 min",
    shieldProtection: false,
    available: true,
    description: "Balanced data for everyday needs.",
  },
  {
    id: "mtn-budget-5gb",
    network: "mtn-budget",
    tier: "budget",
    name: "MTN Budget 5GB",
    volume: "5GB",
    volumeGB: 5,
    price: 21.99,
    deliveryTime: "< 5 min",
    shieldProtection: false,
    available: true,
    description: "High-capacity package for heavy use.",
    bestValue: true,
  },

  // ── AirtelTigo ────────────────────────────────────────────────────────────
  {
    id: "airteltigo-1gb",
    network: "airteltigo",
    tier: "standard",
    name: "AirtelTigo 1GB",
    volume: "1GB",
    volumeGB: 1,
    price: 4.79,
    deliveryTime: "< 3 min",
    shieldProtection: true,
    available: true,
    description: "Essential data for everyday browsing.",
  },
  {
    id: "airteltigo-2gb",
    network: "airteltigo",
    tier: "standard",
    name: "AirtelTigo 2GB",
    volume: "2GB",
    volumeGB: 2,
    price: 8.99,
    deliveryTime: "< 3 min",
    shieldProtection: true,
    available: true,
    description: "Double data for streaming on the go.",
    popular: true,
  },
  {
    id: "airteltigo-3gb",
    network: "airteltigo",
    tier: "standard",
    name: "AirtelTigo 3GB",
    volume: "3GB",
    volumeGB: 3,
    price: 13.49,
    deliveryTime: "< 3 min",
    shieldProtection: true,
    available: true,
    description: "Premium AirtelTigo experience.",
  },
  {
    id: "airteltigo-5gb",
    network: "airteltigo",
    tier: "standard",
    name: "AirtelTigo 5GB",
    volume: "5GB",
    volumeGB: 5,
    price: 22.49,
    deliveryTime: "< 3 min",
    shieldProtection: true,
    available: true,
    description: "All-day data for heavy users.",
    bestValue: true,
  },

  // ── Telecel ───────────────────────────────────────────────────────────────
  {
    id: "telecel-10gb",
    network: "telecel",
    tier: "standard",
    name: "Telecel 10GB",
    volume: "10GB",
    volumeGB: 10,
    price: 44.99,
    deliveryTime: "< 5 min",
    shieldProtection: true,
    available: true,
    description: "A whole week of uninterrupted data.",
  },
  {
    id: "telecel-15gb",
    network: "telecel",
    tier: "standard",
    name: "Telecel 15GB",
    volume: "15GB",
    volumeGB: 15,
    price: 63.99,
    deliveryTime: "< 5 min",
    shieldProtection: true,
    available: true,
    description: "Extended bundle for heavy streamers.",
    popular: true,
  },
  {
    id: "telecel-20gb",
    network: "telecel",
    tier: "standard",
    name: "Telecel 20GB",
    volume: "20GB",
    volumeGB: 20,
    price: 83.99,
    deliveryTime: "< 5 min",
    shieldProtection: true,
    available: true,
    description: "Maximum Telecel package — nothing held back.",
    bestValue: true,
  },
];

// ─── Helper Selectors ─────────────────────────────────────────────────────────
// These mirror the API service interface so callers stay consistent.

export function getBundlesByNetwork(networkId: NetworkId): RawCatalogueBundle[] {
  return DATA_BUNDLES.filter(
    (b) => b.network === networkId && b.available
  );
}

export function getNetworkById(networkId: string): NetworkOption | undefined {
  return NETWORK_OPTIONS.find((n) => n.id === networkId);
}

export function getBundleById(bundleId: string): RawCatalogueBundle | undefined {
  return DATA_BUNDLES.find((b) => b.id === bundleId);
}
