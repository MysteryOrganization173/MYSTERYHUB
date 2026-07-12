/**
 * SupplierAdapter — the pluggable fulfillment provider contract.
 *
 * Mirrors `src/services/catalogue/types.ts`'s `CatalogueSource` pattern:
 * one interface, one mock implementation today, and a single swap point in
 * `fulfillmentService.ts` for the real provider later. SuccessBizHub is the
 * intended first real implementation (per docs/ROADMAP.md), but no such
 * implementation exists yet and this interface is not called from any
 * route — see docs/fulfillment.md.
 */
import type {
  FulfillmentJob,
  SupplierFulfillmentResult,
  SupplierStatusResult,
} from "@/types/fulfillment";

export interface SupplierAdapter {
  /** Submits a job to the supplier. Must be safe to call at most once per
   * `orderReference` in normal operation — `fulfillmentService` is
   * responsible for the idempotency check before calling this, not the
   * adapter itself (see docs/fulfillment.md → "Idempotency"). */
  fulfill(job: FulfillmentJob): Promise<SupplierFulfillmentResult>;

  /** Polls the supplier for the current status of a previously-accepted
   * job, keyed by the `supplierReference` returned from `fulfill()`. Not
   * every supplier needs this (some fulfil synchronously), but the
   * interface always exposes it so `fulfillmentService` has one shape to
   * call regardless of the active adapter. */
  checkStatus(supplierReference: string): Promise<SupplierStatusResult>;
}
