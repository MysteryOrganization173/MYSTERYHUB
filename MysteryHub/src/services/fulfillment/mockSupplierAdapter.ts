/**
 * Mock SupplierAdapter — prepared, unwired.
 *
 * Consistent with `src/services/catalogue/mockCatalogueSource.ts`: exists
 * so `SupplierAdapter` is exercisable and unit-testable today, without a
 * live SuccessBizHub connection. Always "accepts" and reports "delivered"
 * after a simulated delay — no real network call, no persistence.
 *
 * This is NOT wired into `fulfillmentService.ts`'s default export path by
 * any route or webhook — see docs/fulfillment.md.
 */
import type {
  FulfillmentJob,
  SupplierFulfillmentResult,
  SupplierStatusResult,
} from "@/types/fulfillment";
import type { SupplierAdapter } from "./supplierAdapter";

const mockDelay = (ms: number) =>
  new Promise<void>((resolve) => setTimeout(resolve, ms));

export const mockSupplierAdapter: SupplierAdapter = {
  async fulfill(job: FulfillmentJob): Promise<SupplierFulfillmentResult> {
    await mockDelay(300);
    return {
      status: "accepted",
      supplierReference: `mock_${job.orderReference}`,
    };
  },

  async checkStatus(_supplierReference: string): Promise<SupplierStatusResult> {
    await mockDelay(100);
    return { status: "delivered" };
  },
};
