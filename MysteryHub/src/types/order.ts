/**
 * Order domain types — V1 Backend Foundation.
 *
 * `OrderRecord` is the camelCase shape used by services/components.
 * `OrderRow` / `OrderInsert` are raw DB shapes (snake_case), imported only
 * inside the service layer.
 *
 * Naming note: this is intentionally called `OrderRecord`, not `Order`, to
 * avoid colliding with the legacy mystery-box `Order` interface already
 * defined in src/types/index.ts. That legacy type is unrelated to internet
 * package purchases and is deferred per docs/project-audit.md (§ "Clarify
 * the two 'bundle' types"). Do not merge the two without a deliberate
 * migration — this file is the active commerce order model.
 */
import type {
  Database,
  OrderPaymentStatus,
  OrderFulfillmentStatus,
} from "./database";

export type { OrderPaymentStatus, OrderFulfillmentStatus };

export type OrderRow = Database["public"]["Tables"]["orders"]["Row"];
export type OrderInsert = Database["public"]["Tables"]["orders"]["Insert"];

export interface OrderRecord {
  id: string;
  reference: string;
  userId: string | null;
  network: string;
  bundleId: string;
  bundleName: string;
  recipientPhone: string;
  amount: number;
  currency: string;
  paymentStatus: OrderPaymentStatus;
  paymentReference: string | null;
  fulfillmentStatus: OrderFulfillmentStatus;
  /** The active supplier's own order/transaction id, once accepted. */
  supplierReference: string | null;
  /** Last customer-safe fulfillment error message, if any. */
  fulfillmentError: string | null;
  createdAt: string;
  updatedAt: string;
}

/** Input shape for creating a new order. Matches the fields the buy flow
 * will eventually have available at checkout time (Phase 2+ wiring). */
export interface NewOrderInput {
  reference: string;
  userId?: string | null;
  network: string;
  bundleId: string;
  bundleName: string;
  recipientPhone: string;
  amount: number;
  currency?: string;
}

export function mapOrderRow(row: OrderRow): OrderRecord {
  return {
    id: row.id,
    reference: row.reference,
    userId: row.user_id,
    network: row.network,
    bundleId: row.bundle_id,
    bundleName: row.bundle_name,
    recipientPhone: row.recipient_phone,
    amount: row.amount,
    currency: row.currency,
    paymentStatus: row.payment_status,
    paymentReference: row.payment_reference,
    fulfillmentStatus: row.fulfillment_status,
    supplierReference: row.supplier_reference,
    fulfillmentError: row.fulfillment_error,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}
