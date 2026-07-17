/**
 * Fulfillment layer barrel — wired (V1.5). See docs/fulfillment.md and
 * docs/product-audit.md.
 */
export { fulfillmentService } from "./fulfillmentService";
export { mockSupplierAdapter } from "./mockSupplierAdapter";
export type { SupplierAdapter } from "./supplierAdapter";
export { inMemoryFulfillmentQueue } from "./queue";
export type { FulfillmentQueue, EnqueueOptions } from "./queue";
export {
  DEFAULT_MAX_FULFILLMENT_ATTEMPTS,
  shouldRetry,
  nextRetryDelayMs,
} from "./retryStrategy";
