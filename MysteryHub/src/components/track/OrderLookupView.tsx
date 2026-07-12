"use client";

/**
 * OrderLookupView — Mystery Hub V1 Phase 4 (Order Tracking).
 *
 * Owns all client-side state for `/track`: the current reference, loading,
 * error, and the resolved `OrderRecord`. Composes `OrderLookupForm`,
 * `OrderDetailsCard`, and `OrderStatusTimeline`. Calls
 * `GET /api/orders/[reference]` via `apiClient` — never touches
 * `ordersService` directly (that's server-only).
 *
 * Reads an optional `?ref=` query param so BuyFlow's "Track Order" button
 * can deep-link straight to a freshly placed order's status.
 *
 * Read-only: makes no writes, calls no SuccessBizHub endpoint.
 */
import { useEffect, useState, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import { PackageSearch, SearchX } from "lucide-react";
import { apiClient } from "@/services/api";
import type { OrderRecord } from "@/types/order";
import { OrderLookupForm } from "./OrderLookupForm";
import { OrderDetailsCard } from "./OrderDetailsCard";
import { OrderStatusTimeline } from "./OrderStatusTimeline";

export function OrderLookupView() {
  const searchParams = useSearchParams();
  const initialRef = searchParams.get("ref") ?? "";

  const [order, setOrder] = useState<OrderRecord | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  const lookup = useCallback(async (reference: string) => {
    setIsLoading(true);
    setError(null);
    setHasSearched(true);

    const { data, error: apiError } = await apiClient.get<OrderRecord>(
      `/orders/${encodeURIComponent(reference)}`
    );

    setOrder(data ?? null);
    setError(apiError);
    setIsLoading(false);
  }, []);

  // Auto-run the lookup once if a `?ref=` deep link was provided.
  useEffect(() => {
    if (initialRef.trim()) {
      lookup(initialRef.trim());
    }
    // Only run for the initial query param, not on every render.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-border bg-card p-5">
        <OrderLookupForm initialValue={initialRef} isLoading={isLoading} onSubmit={lookup} />
      </div>

      {isLoading && (
        <div className="flex flex-col items-center justify-center gap-2 py-16 text-center">
          <span className="h-5 w-5 animate-spin rounded-full border-2 border-brand border-t-transparent" />
          <p className="text-xs text-muted-foreground">Looking up your order…</p>
        </div>
      )}

      {!isLoading && hasSearched && error && (
        <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-border bg-card py-16 px-4 text-center">
          <SearchX className="h-8 w-8 text-muted-foreground" aria-hidden />
          <div className="space-y-1">
            <p className="text-sm font-semibold text-foreground">
              {error === "Order not found"
                ? "We couldn't find that order"
                : "Something went wrong"}
            </p>
            <p className="text-xs text-muted-foreground max-w-xs mx-auto">
              {error === "Order not found"
                ? "Double-check your order reference and try again."
                : error}
            </p>
          </div>
        </div>
      )}

      {!isLoading && !hasSearched && (
        <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-border py-16 px-4 text-center">
          <PackageSearch className="h-8 w-8 text-brand" aria-hidden />
          <p className="text-sm text-muted-foreground max-w-xs">
            Enter your order reference above to see its payment and delivery status.
          </p>
        </div>
      )}

      {!isLoading && order && (
        <div className="grid gap-6 lg:grid-cols-[1.3fr_1fr]">
          <OrderDetailsCard order={order} />
          <div className="rounded-xl border border-border bg-card p-5">
            <h3 className="mb-4 text-sm font-semibold text-foreground">Order Progress</h3>
            <OrderStatusTimeline
              paymentStatus={order.paymentStatus}
              fulfillmentStatus={order.fulfillmentStatus}
            />
          </div>
        </div>
      )}
    </div>
  );
}
