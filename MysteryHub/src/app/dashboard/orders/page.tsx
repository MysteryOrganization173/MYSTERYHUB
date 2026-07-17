"use client";

import * as React from "react";
import Link from "next/link";
import { PageHeader } from "@/components/layout/PageHeader";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { BrandImage } from "@/components/shared/BrandImage";
import { apiClient } from "@/services/api";
import { formatGHS, formatDate } from "@/lib/utils";
import { ROUTES } from "@/constants";
import { UTILITY_IMAGES } from "@/config/images";
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

export default function DashboardOrdersPage() {
  const [orders, setOrders] = React.useState<OrderRecord[] | null>(null);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    apiClient.get<OrderRecord[]>("/orders").then(({ data, error }) => {
      setOrders(data ?? []);
      setError(error);
    });
  }, []);

  return (
    <div className="space-y-6">
      <PageHeader
        badge="My Account"
        title="Orders"
        description={
          orders ? `${orders.length} order${orders.length === 1 ? "" : "s"} on record.` : "Loading…"
        }
      />

      {error && <p className="text-sm text-destructive">{error}</p>}

      {orders && orders.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center gap-3 p-10 text-center">
            <BrandImage image={UTILITY_IMAGES.emptyOrders} className="h-28 w-28" />
            <p className="text-sm text-muted-foreground">
              No orders yet. Once you buy a bundle, it&apos;ll show up here with live delivery
              status.
            </p>
            <Button asChild variant="brand" size="sm" className="rounded-lg">
              <Link href={ROUTES.buy}>Buy a bundle</Link>
            </Button>
          </CardContent>
        </Card>
      )}

      {orders && orders.length > 0 && (
        <div className="overflow-x-auto rounded-xl border border-border">
          <table className="w-full min-w-[720px] text-sm">
            <thead className="border-b border-border bg-muted/30 text-left text-xs text-muted-foreground">
              <tr>
                <th className="px-4 py-3 font-medium">Reference</th>
                <th className="px-4 py-3 font-medium">Bundle</th>
                <th className="px-4 py-3 font-medium">Amount</th>
                <th className="px-4 py-3 font-medium">Payment</th>
                <th className="px-4 py-3 font-medium">Delivery</th>
                <th className="px-4 py-3 font-medium">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {orders.map((order) => (
                <tr key={order.id} className="hover:bg-muted/20">
                  <td className="px-4 py-3 font-mono text-xs text-foreground">
                    <Link href={`${ROUTES.track}?ref=${order.reference}`} className="hover:text-brand hover:underline">
                      {order.reference}
                    </Link>
                  </td>
                  <td className="px-4 py-3">
                    <p className="text-foreground">{order.bundleName}</p>
                    <p className="text-xs text-muted-foreground">{order.recipientPhone}</p>
                  </td>
                  <td className="px-4 py-3 font-medium text-foreground">{formatGHS(order.amount)}</td>
                  <td className="px-4 py-3">
                    <Badge variant={PAYMENT_BADGE[order.paymentStatus]}>{order.paymentStatus}</Badge>
                  </td>
                  <td className="px-4 py-3">
                    <Badge variant={FULFILLMENT_BADGE[order.fulfillmentStatus]}>
                      {order.fulfillmentStatus}
                    </Badge>
                    {order.fulfillmentError && (
                      <p className="mt-1 max-w-[200px] text-[11px] text-destructive">
                        {order.fulfillmentError}
                      </p>
                    )}
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
