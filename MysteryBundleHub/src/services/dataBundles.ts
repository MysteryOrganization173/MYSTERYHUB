/**
 * Data Bundle Service — Mystery Hub
 *
 * This is the ONLY file that needs to change when the SuccessBizHub API goes live.
 *
 * Current state  → uses mock data from src/data/bundles.ts
 * Future state   → calls SuccessBizHub API via apiClient
 *
 * INTEGRATION CHECKLIST (when API is ready):
 * ─────────────────────────────────────────
 * 1. Add to .env:
 *      NEXT_PUBLIC_SUCCESSBIZHUB_URL=https://api.successbizhub.com/v1
 *      SUCCESSBIZHUB_API_KEY=your_key_here
 *
 * 2. Replace each function body with the commented-out API call below it.
 *
 * 3. Map ApiBundleResponse → DataBundle using the `mapBundle` helper
 *    at the bottom of this file.
 *
 * 4. Delete this preamble comment and src/data/bundles.ts when confirmed working.
 */

import type {
  DataBundle,
  NetworkOption,
  ApiOrderRequest,
  ApiOrderResponse,
  ApiBundleResponse,
} from "@/types/bundle";
import {
  NETWORK_OPTIONS,
  getBundlesByNetwork,
} from "@/data/bundles";

// ─── Simulated network latency (remove with real API) ────────────────────────
const mockDelay = (ms: number) =>
  new Promise<void>((resolve) => setTimeout(resolve, ms));

// ─── Service ─────────────────────────────────────────────────────────────────

export const dataBundlesService = {
  /**
   * Returns all available networks.
   *
   * REAL API → GET /successbizhub/networks
   * Response:  { networks: ApiBundleResponse[] }  (grouped by network)
   */
  getNetworks: async (): Promise<NetworkOption[]> => {
    await mockDelay(150);
    return NETWORK_OPTIONS.filter((n) => n.available);
    // ── Replace above with: ─────────────────────────────────────────────────
    // const { data, error } = await apiClient.get<{ networks: NetworkOption[] }>(
    //   '/successbizhub/networks'
    // )
    // if (error || !data) throw new Error(error ?? 'Failed to load networks')
    // return data.networks
  },

  /**
   * Returns available bundles for a given network.
   *
   * REAL API → GET /successbizhub/bundles?network={networkId}
   * Response:  { bundles: ApiBundleResponse[] }
   */
  getBundles: async (networkId: string): Promise<DataBundle[]> => {
    await mockDelay(200);
    return getBundlesByNetwork(networkId as DataBundle["network"]);
    // ── Replace above with: ─────────────────────────────────────────────────
    // const { data, error } = await apiClient.get<{ bundles: ApiBundleResponse[] }>(
    //   `/successbizhub/bundles?network=${networkId}`
    // )
    // if (error || !data) throw new Error(error ?? 'Failed to load bundles')
    // return data.bundles.map(mapBundle)
  },

  /**
   * Submits a data purchase order.
   * Currently returns a mock reference — no payment processed.
   *
   * REAL API → POST /successbizhub/orders
   * Body:      ApiOrderRequest
   * Response:  ApiOrderResponse
   */
  placeOrder: async (order: ApiOrderRequest): Promise<ApiOrderResponse> => {
    await mockDelay(1400);
    const reference =
      "MH-" +
      Math.random().toString(36).substring(2, 8).toUpperCase() +
      "-" +
      Date.now().toString(36).toUpperCase();
    return {
      order_id: `ord_${Date.now()}`,
      status: "processing",
      reference,
      estimated_delivery: "Within 2 minutes",
    };
    // ── Replace above with: ─────────────────────────────────────────────────
    // const { data, error } = await apiClient.post<ApiOrderResponse>(
    //   '/successbizhub/orders',
    //   order
    // )
    // if (error || !data) throw new Error(error ?? 'Order failed')
    // return data
  },

  /**
   * Checks the status of an existing order by reference.
   *
   * REAL API → GET /successbizhub/orders/{reference}
   * Response:  ApiOrderResponse
   */
  getOrderStatus: async (reference: string): Promise<ApiOrderResponse> => {
    await mockDelay(300);
    return {
      order_id: `ord_${Date.now()}`,
      status: "delivered",
      reference,
      estimated_delivery: "Delivered",
    };
    // ── Replace above with: ─────────────────────────────────────────────────
    // const { data, error } = await apiClient.get<ApiOrderResponse>(
    //   `/successbizhub/orders/${reference}`
    // )
    // if (error || !data) throw new Error(error ?? 'Failed to fetch order status')
    // return data
  },
};

// ─── API Response Mapper (used when real API is connected) ────────────────────

export function mapBundle(
  raw: ApiBundleResponse,
  networkId: DataBundle["network"]
): DataBundle {
  const volumeGB = Math.round(raw.capacity_mb / 1024);
  return {
    id: raw.bundle_id,
    network: networkId,
    tier: networkId.includes("express")
      ? "express"
      : networkId.includes("budget")
        ? "budget"
        : "standard",
    name: `${networkId.toUpperCase()} ${volumeGB}GB`,
    volume: `${volumeGB}GB`,
    volumeGB,
    price: parseFloat(raw.price),
    deliveryTime: `< ${raw.delivery_minutes} min`,
    shieldProtection: raw.active,
    available: raw.active,
    description: raw.description ?? "",
  };
}
