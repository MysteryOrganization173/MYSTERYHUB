/**
 * Internet Package / Mobile Connectivity Types — Mystery Hub
 *
 * These types cover mobile network internet packages (one service in the
 * digital services ecosystem). Prefer “Internet Packages” in UI copy.
 * Distinct from any legacy catalog types in src/types/index.ts.
 *
 * Architecture note:
 *   - Components consume `DataBundle` and `NetworkOption` only.
 *   - `ApiBundleResponse` / `ApiOrderRequest` / `ApiOrderResponse` define the
 *     SuccessBizHub wire shapes for order placement/status
 *     (src/services/dataBundles.ts). Catalog reads (networks/bundles) are
 *     owned by the catalogue layer instead — see
 *     `src/services/catalogue/catalogueService.ts` and `docs/catalogue.md`.
 *   - Components never touch API/raw provider shapes directly.
 */

// ─── Network Providers ────────────────────────────────────────────────────────

export type NetworkId =
  | "mtn-express"
  | "mtn-budget"
  | "airteltigo"
  | "telecel";

// ─── Bundle Tier ──────────────────────────────────────────────────────────────

export type DataTier = "express" | "budget" | "standard";

// ─── Individual Data Bundle (SKU) ─────────────────────────────────────────────

export interface DataBundle {
  id: string;
  network: NetworkId;
  tier: DataTier;
  /** Display name, e.g. "MTN Express 2GB" */
  name: string;
  /** Human-readable volume label, e.g. "2GB" */
  volume: string;
  /** Numeric volume in GB — used for sorting and comparisons */
  volumeGB: number;
  /** Numeric price, denominated in `currency` */
  price: number;
  /** Always "GHS" today — attached by the catalogue layer's bundle mapper,
   * never trusted from raw provider data. See `CATALOGUE_CURRENCY` in
   * `src/services/catalogue/types.ts`. */
  currency: "GHS";
  /** e.g. "< 2 min" — displayed on the bundle card */
  deliveryTime: string;
  /** Whether Mystery Hub's delivery guarantee is active for this bundle */
  shieldProtection: boolean;
  available: boolean;
  description: string;
  /** Highlighted as a top-selling option */
  popular?: boolean;
  /** Highlighted as the best $/GB ratio in its network group */
  bestValue?: boolean;
}

// ─── Network Option (group of bundles) ───────────────────────────────────────

export interface NetworkOption {
  id: NetworkId;
  /** Full display name, e.g. "MTN Express" */
  name: string;
  /** Short abbreviation for tight spaces, e.g. "MTN" */
  shortName: string;
  /** Brand hex colour used for inline styles (#FFD200) */
  color: string;
  description: string;
  available: boolean;
}

// ─── Purchase Flow ────────────────────────────────────────────────────────────

export type PurchaseStep = 1 | 2 | 3 | 4;

export interface PurchaseState {
  step: PurchaseStep;
  selectedNetwork: NetworkId | null;
  selectedBundle: DataBundle | null;
  phoneNumber: string;
  isProcessing: boolean;
}

export interface PurchaseOrder {
  network: NetworkId;
  bundle: DataBundle;
  phoneNumber: string;
}

// ─── SuccessBizHub API Contract ───────────────────────────────────────────────
//
// These are the shapes returned by / sent to the SuccessBizHub order
// endpoints, consumed by `dataBundlesService` (placeOrder/getOrderStatus).
// Catalog reads have their own raw shapes in
// `src/services/catalogue/types.ts` (`RawCatalogueBundle`/`RawCatalogueNetwork`)
// instead of `ApiBundleResponse` below — see docs/catalogue.md.
//
// When SuccessBizHub is ready for orders:
//   1. Update `dataBundlesService.placeOrder` to call the real endpoint.
//   2. Update `dataBundlesService.getOrderStatus` to call the real endpoint.
//   3. Components (OrderSummary, BuyFlow, etc.) require zero changes.

export interface ApiBundleResponse {
  /** SuccessBizHub internal bundle ID */
  bundle_id: string;
  network: string;
  /** Capacity in MB — divide by 1024 for volumeGB */
  capacity_mb: number;
  price: string;
  /** Estimated delivery in minutes */
  delivery_minutes: number;
  active: boolean;
  description?: string;
}

export interface ApiOrderRequest {
  bundle_id: string;
  recipient_phone: string;
  /** Optional idempotency key — generate a UUID client-side */
  reference?: string;
}

export interface ApiOrderResponse {
  order_id: string;
  status: "pending" | "processing" | "delivered" | "failed";
  reference: string;
  estimated_delivery?: string;
}
