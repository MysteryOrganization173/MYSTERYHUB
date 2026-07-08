/**
 * Data Bundle Types — Mystery Hub
 *
 * These types cover the mobile data purchasing domain.
 * Distinct from the Mystery Box `Bundle` type in src/types/index.ts.
 *
 * Architecture note:
 *   - Components consume `DataBundle` and `NetworkOption` only.
 *   - `ApiBundleResponse` / `ApiOrderRequest` / `ApiOrderResponse` define the
 *     SuccessBizHub wire shapes. The service layer (src/services/dataBundles.ts)
 *     maps between them. Components never touch API shapes directly.
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
  /** Price in USD */
  price: number;
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
// These are the shapes returned by / sent to the SuccessBizHub API.
// When the API is ready:
//   1. Update `dataBundlesService.getNetworks` to call the real endpoint.
//   2. Update `dataBundlesService.getBundles` to call the real endpoint.
//   3. Map `ApiBundleResponse` → `DataBundle` inside the service.
//   4. Components (NetworkSelector, BundleCard, etc.) require zero changes.

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
