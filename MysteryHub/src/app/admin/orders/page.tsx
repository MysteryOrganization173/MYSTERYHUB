"use client";

import * as React from "react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Badge } from "@/components/ui/badge";
import { apiClient } from "@/services/api";
import { formatGHS, formatDate } from "@/lib/utils";
import type { OrderRecord } from "@/types/order";

const PAYMENT_BADGE: Record<OrderRecord["paymentStatus"], "brand" | "muted" | "destructive"> = {
  paid: "brand",
  pending: "muted",
  failed: "destructive",
  refunded: "muted",
};

const FULFILLMENT_BADGE: Record<OrderRecord["fulfillmentStatus"], "brand" | "muted" | "destructive"> = {
  delivered: "brand",
  pending: "muted",
  processing: "muted",
  failed: "destructive",
};

export default function AdminOrdersPage() {
  const [orders, setOrders] = React.useState<OrderRecord[] | null>(null);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    apiClient.get<OrderRecord[]>("/admin/orders").then(({ data, error }) => {
      setOrders(data ?? []);
      setError(error);
    });
  }, []);

  return (
    <div className="space-y-6">
      <PageHeader
        badge="Admin"
        title="Orders"
        description={
          orders ? `${orders.length} order${orders.length === 1 ? "" : "s"} on record.` : "Loading…"
        }
      />

      {error && <p className="text-sm text-destructive">{error}</p>}

      {orders && orders.length === 0 && (
        <p className="text-sm text-muted-foreground">No orders yet.</p>
      )}

      {orders && orders.length > 0 && (
        <div className="overflow-x-auto rounded-xl border border-border">
          <table className="w-full min-w-[880px] text-sm">
            <thead className="border-b border-border bg-muted/30 text-left text-xs text-muted-foreground">
              <tr>
                <th className="px-4 py-3 font-medium">Reference</th>
                <th className="px-4 py-3 font-medium">Bundle</th>
                <th className="px-4 py-3 font-medium">Phone</th>
                <th className="px-4 py-3 font-medium">Amount</th>
                <th className="px-4 py-3 font-medium">Payment</th>
                <th className="px-4 py-3 font-medium">Fulfillment</th>
                <th className="px-4 py-3 font-medium">Supplier ref.</th>
                <th className="px-4 py-3 font-medium">Created</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {orders.map((order) => (
                <tr key={order.id} className="hover:bg-muted/20">
                  <td className="px-4 py-3 font-mono text-xs text-foreground">{order.reference}</td>
                  <td className="px-4 py-3 text-foreground">{order.bundleName}</td>
                  <td className="px-4 py-3 text-muted-foreground">{order.recipientPhone}</td>
                  <td className="px-4 py-3 font-medium text-foreground">{formatGHS(order.amount)}</td>
                  <td className="px-4 py-3">
                    <Badge variant={PAYMENT_BADGE[order.paymentStatus]}>{order.paymentStatus}</Badge>
                  </td>
                  <td className="px-4 py-3">
                    <Badge variant={FULFILLMENT_BADGE[order.fulfillmentStatus]}>
                      {order.fulfillmentStatus}
                    </Badge>
                    {order.fulfillmentError && (
                      <p className="mt-1 max-w-[220px] text-[11px] text-destructive">
                        {order.fulfillmentError}
                      </p>
                    )}
                  </td>
                  <td className="px-4 py-3 font-mono text-[11px] text-muted-foreground">
                    {order.supplierReference ?? "—"}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-muted-foreground">
                    {formatDate(order.createdAt, { month: "short", day: "numeric", year: "numeric" })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
