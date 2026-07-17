/**
 * SuccessBizHub Fulfillment Adapter — implements `SupplierAdapter`.
 *
 * Same honesty guarantee as `catalogueAdapter.ts`: never fabricates an
 * "accepted"/"delivered" result. Any failure to reach or parse a response
 * from SuccessBizHub (including "not configured") resolves to
 * `{ status: "rejected" }`, which `fulfillmentService.ts` turns into a
 * "temporarily unavailable" order state — never a fabricated delivery.
 *
 * Wire shape assumption (unverified — no public SuccessBizHub docs): the
 * `bundle_id` SuccessBizHub expects is the SKU without Mystery Hub's own
 * `${network}-` prefix (e.g. `mtn-express-2gb` -> `2gb`). This mirrors
 * `catalogueAdapter.ts`'s bundle ids and is a best-effort mapping to
 * revisit once real docs/sandbox responses exist.
 */
import type {
  FulfillmentJob,
  SupplierFulfillmentResult,
  SupplierStatusResult,
} from "@/types/fulfillment";
import type { SupplierAdapter } from "@/services/fulfillment/supplierAdapter";
import { successBizHubRequest } from "./client";

interface SuccessBizHubOrderResponse {
  order_id: string;
  status: "pending" | "processing" | "delivered" | "failed";
}

function toSupplierSlug(job: FulfillmentJob): string {
  const prefix = `${job.network}-`;
  return job.bundleId.startsWith(prefix)
    ? job.bundleId.slice(prefix.length)
    : job.bundleId;
}

export const successBizHubFulfillmentAdapter: SupplierAdapter = {
  async fulfill(job: FulfillmentJob): Promise<SupplierFulfillmentResult> {
    const { data, error } = await successBizHubRequest<SuccessBizHubOrderResponse>({
      method: "POST",
      path: "/orders",
      body: {
        bundle_id: toSupplierSlug(job),
        recipient_phone: job.recipientPhone,
        reference: job.orderReference,
      },
    });

    if (error || !data) {
      return {
        status: "rejected",
        supplierReference: null,
        error: error ?? "SuccessBizHub returned no order data",
      };
    }

    return {
      status: data.status === "failed" ? "rejected" : "accepted",
      supplierReference: data.order_id ?? null,
      error: data.status === "failed" ? "SuccessBizHub rejected the order" : undefined,
    };
  },

  async checkStatus(supplierReference: string): Promise<SupplierStatusResult> {
    const { data, error } = await successBizHubRequest<SuccessBizHubOrderResponse>({
      method: "GET",
      path: `/orders/${encodeURIComponent(supplierReference)}`,
    });

    if (error || !data) {
      return { status: "failed", error: error ?? "Unable to check order status" };
    }

    if (data.status === "delivered") return { status: "delivered" };
    if (data.status === "failed") return { status: "failed", error: "SuccessBizHub reported delivery failure" };
    return { status: "processing" };
  },
};
