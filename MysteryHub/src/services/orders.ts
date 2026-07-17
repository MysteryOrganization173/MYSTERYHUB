/**
 * Orders Service — V1 Backend Foundation.
 *
 * Server-only (imports the service-role admin client). Persists internet
 * package orders so the purchase flow can become a real transaction system.
 *
 * NOT yet wired into src/app/buy or src/components/buy/* — this phase only
 * builds the foundation. Wiring the buy flow to call `createOrder` (and the
 * success/track screens to call `getOrderByReference`) is a later, separate
 * change per docs/v1-implementation-plan.md.
 *
 * Funnel this service supports (see migration file for schema rationale):
 *   customer selects package
 *     -> createOrder()                         [payment + fulfillment = "pending"]
 *     -> updatePaymentStatus()                 [independent of fulfillment]
 *     -> updateFulfillmentStatus()              [can happen later]
 *     -> getOrderByReference() / getOrdersForUser()   [used by /track later]
 */
import { supabaseAdminClient } from "@/lib/supabase/admin";
import {
  mapOrderRow,
  type NewOrderInput,
  type OrderRecord,
  type OrderPaymentStatus,
  type OrderFulfillmentStatus,
} from "@/types/order";
import type { ApiResponse } from "@/types";

/** Generates a shareable order reference, e.g. "MH-8F2K3P-LX9QZ1WF".
 * Matches the format already used by the mock in src/services/dataBundles.ts
 * so the eventual UI wiring requires no display-format changes. */
export function generateOrderReference(): string {
  const random = Math.random().toString(36).substring(2, 8).toUpperCase();
  const time = Date.now().toString(36).toUpperCase();
  return `MH-${random}-${time}`;
}

export const ordersService = {
  /** Creates an order row with payment_status = "pending" and
   * fulfillment_status = "pending". */
  async createOrder(input: NewOrderInput): Promise<ApiResponse<OrderRecord>> {
    const { data, error } = await supabaseAdminClient
      .from("orders")
      .insert({
        reference: input.reference,
        user_id: input.userId ?? null,
        network: input.network,
        bundle_id: input.bundleId,
        bundle_name: input.bundleName,
        recipient_phone: input.recipientPhone,
        amount: input.amount,
        currency: input.currency ?? "GHS",
      })
      .select()
      .single();

    if (error || !data) {
      return { data: null, error: error?.message ?? "Failed to create order" };
    }
    return { data: mapOrderRow(data), error: null };
  },

  /** Looks up a single order by its public reference. Used by guest and
   * signed-in tracking alike — callers are responsible for not exposing a
   * broad "list all orders" surface for guests. */
  async getOrderByReference(
    reference: string
  ): Promise<ApiResponse<OrderRecord>> {
    const { data, error } = await supabaseAdminClient
      .from("orders")
      .select()
      .eq("reference", reference)
      .maybeSingle();

    if (error) {
      return { data: null, error: error.message };
    }
    if (!data) {
      return { data: null, error: "Order not found" };
    }
    return { data: mapOrderRow(data), error: null };
  },

  /** Lists orders for a signed-in user, newest first. Unused until an auth
   * UI and account/orders view exist. */
  async getOrdersForUser(userId: string): Promise<ApiResponse<OrderRecord[]>> {
    const { data, error } = await supabaseAdminClient
      .from("orders")
      .select()
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) {
      return { data: null, error: error.message };
    }
    return { data: (data ?? []).map(mapOrderRow), error: null };
  },

  /** Updates payment_status independently of fulfillment_status. Intended
   * caller: a future payment webhook handler (not built in this phase). */
  async updatePaymentStatus(
    reference: string,
    paymentStatus: OrderPaymentStatus,
    paymentReference?: string
  ): Promise<ApiResponse<OrderRecord>> {
    const { data, error } = await supabaseAdminClient
      .from("orders")
      .update({
        payment_status: paymentStatus,
        ...(paymentReference ? { payment_reference: paymentReference } : {}),
      })
      .eq("reference", reference)
      .select()
      .single();

    if (error || !data) {
      return {
        data: null,
        error: error?.message ?? "Failed to update payment status",
      };
    }
    return { data: mapOrderRow(data), error: null };
  },

  /** Updates fulfillment_status independently of payment_status, plus
   * optional supplier detail so `/track` and the admin orders view can
   * show exactly what a real supplier said (never a fabricated status). */
  async updateFulfillmentStatus(
    reference: string,
    fulfillmentStatus: OrderFulfillmentStatus,
    detail?: { supplierReference?: string | null; fulfillmentError?: string | null }
  ): Promise<ApiResponse<OrderRecord>> {
    const { data, error } = await supabaseAdminClient
      .from("orders")
      .update({
        fulfillment_status: fulfillmentStatus,
        ...(detail?.supplierReference !== undefined
          ? { supplier_reference: detail.supplierReference }
          : {}),
        ...(detail?.fulfillmentError !== undefined
          ? { fulfillment_error: detail.fulfillmentError }
          : {}),
      })
      .eq("reference", reference)
      .select()
      .single();

    if (error || !data) {
      return {
        data: null,
        error: error?.message ?? "Failed to update fulfillment status",
      };
    }
    return { data: mapOrderRow(data), error: null };
  },

  /** Admin-only: lists every order, newest first. Callers are responsible
   * for the admin check (see docs/authentication.md). */
  async listAllOrders(limit = 200): Promise<ApiResponse<OrderRecord[]>> {
    const { data, error } = await supabaseAdminClient
      .from("orders")
      .select()
      .order("created_at", { ascending: false })
      .limit(limit);

    if (error) {
      return { data: null, error: error.message };
    }
    return { data: (data ?? []).map(mapOrderRow), error: null };
  },

  /** Admin-only: aggregate counts for the admin dashboard. Computed from
   * a single bounded fetch (matches `listAllOrders`'s limit) rather than a
   * separate SQL aggregate — acceptable at this scale; revisit with a
   * Postgres view/RPC if order volume grows well past this limit. */
  async getOrderStats(): Promise<
    ApiResponse<{
      totalOrders: number;
      paidOrders: number;
      deliveredOrders: number;
      failedFulfillments: number;
      totalRevenue: number;
    }>
  > {
    const { data, error } = await supabaseAdminClient
      .from("orders")
      .select("amount, payment_status, fulfillment_status")
      .limit(2000);

    if (error) {
      return { data: null, error: error.message };
    }

    const rows = data ?? [];
    const paidRows = rows.filter((r) => r.payment_status === "paid");

    return {
      data: {
        totalOrders: rows.length,
        paidOrders: paidRows.length,
        deliveredOrders: rows.filter((r) => r.fulfillment_status === "delivered").length,
        failedFulfillments: rows.filter((r) => r.fulfillment_status === "failed").length,
        totalRevenue: Number(
          paidRows.reduce((sum, r) => sum + Number(r.amount), 0).toFixed(2)
        ),
      },
      error: null,
    };
  },
};
