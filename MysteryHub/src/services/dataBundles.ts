/**
 * Internet Packages Order Service — Mystery Hub
 *
 * Owns order placement/status only. Catalog reads (networks/bundles) moved
 * to `src/services/catalogue/catalogueService.ts` — see docs/catalogue.md.
 * This is still the file to change when the SuccessBizHub order endpoints
 * go live.
 *
 * Current state  → returns mock order responses.
 * Future state   → calls SuccessBizHub API via apiClient.
 *
 * INTEGRATION CHECKLIST (when API is ready):
 * ─────────────────────────────────────────
 * 1. Add to .env:
 *      NEXT_PUBLIC_SUCCESSBIZHUB_URL=https://api.successbizhub.com/v1
 *      SUCCESSBIZHUB_API_KEY=your_key_here
 *
 * 2. Replace each function body with the commented-out API call below it.
 */

import type { ApiOrderRequest, ApiOrderResponse } from "@/types/bundle";

// ─── Simulated network latency (remove with real API) ────────────────────────
const mockDelay = (ms: number) =>
  new Promise<void>((resolve) => setTimeout(resolve, ms));

// ─── Service ─────────────────────────────────────────────────────────────────

export const dataBundlesService = {
  /**
   * Submits a data purchase order.
   * Currently returns a mock reference — no payment processed.
   *
   * REAL API → POST /successbizhub/orders
   * Body:      ApiOrderRequest
   * Response:  ApiOrderResponse
   */
  placeOrder: async (_order: ApiOrderRequest): Promise<ApiOrderResponse> => {
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
