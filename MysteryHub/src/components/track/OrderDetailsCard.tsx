"use client";

/**
 * OrderDetailsCard — Mystery Hub V1 Phase 4 (Order Tracking).
 *
 * Reusable, read-only display of one `OrderRecord`'s required fields:
 * reference, network, package, phone, amount (GHS), payment status,
 * fulfillment status, created/updated dates. Styled as a receipt-style
 * card, matching the row pattern already used by
 * `src/components/buy/OrderSummary.tsx`.
 *
 * Resolves the network's display name/colour via `catalogueService`
 * (never `src/data/bundles.ts` directly — see docs/catalogue.md's rule),
 * since `OrderRecord.network` only stores the raw network id.
 */
import { useEffect, useState } from "react";
import { Hash, Wifi, Package, Phone, Wallet, CalendarClock, RefreshCcw } from "lucide-react";
import { cn, formatGHS, formatDate } from "@/lib/utils";
import { catalogueService } from "@/services/catalogue";
import type { NetworkOption } from "@/types/bundle";
import type { OrderRecord } from "@/types/order";
import { PaymentStatusBadge, FulfillmentStatusBadge } from "./StatusBadge";

interface OrderDetailsCardProps {
  order: OrderRecord;
  className?: string;
}

export function OrderDetailsCard({ order, className }: OrderDetailsCardProps) {
  const [network, setNetwork] = useState<NetworkOption | null>(null);

  useEffect(() => {
    let cancelled = false;
    catalogueService.getNetworks().then(({ data }) => {
      if (cancelled) return;
      setNetwork(data?.find((n) => n.id === order.network) ?? null);
    });
    return () => {
      cancelled = true;
    };
  }, [order.network]);

  const networkLabel = network?.name ?? order.network;
  const networkColor = network?.color ?? "#18C964";
  const displayPhone = order.recipientPhone;

  return (
    <div className={cn("overflow-hidden rounded-xl border border-border bg-card", className)}>
      {/* Header — network colour strip, matches OrderSummary.tsx */}
      <div
        className="flex items-center gap-3 px-5 py-4"
        style={{
          background: `linear-gradient(135deg, ${networkColor}18 0%, ${networkColor}08 100%)`,
          borderBottom: `1px solid ${networkColor}30`,
        }}
      >
        <div
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-sm font-black"
          style={{
            backgroundColor: `${networkColor}20`,
            border: `1.5px solid ${networkColor}50`,
            color: networkColor,
          }}
        >
          {(network?.shortName ?? order.network).slice(0, 2).toUpperCase()}
        </div>
        <div className="min-w-0">
          <p className="font-semibold text-foreground truncate">{order.bundleName}</p>
          <p className="text-xs text-muted-foreground">{networkLabel}</p>
        </div>
        <span className="ml-auto shrink-0 font-mono text-xs font-bold text-brand">
          {order.reference}
        </span>
      </div>

      {/* Rows */}
      <div className="divide-y divide-border/40">
        <DetailRow icon={<Hash className="h-4 w-4" />} label="Order Reference" value={order.reference} mono />
        <DetailRow icon={<Wifi className="h-4 w-4" />} label="Network" value={networkLabel} />
        <DetailRow icon={<Package className="h-4 w-4" />} label="Package" value={order.bundleName} />
        <DetailRow icon={<Phone className="h-4 w-4" />} label="Phone Number" value={displayPhone} />
        <DetailRow
          icon={<Wallet className="h-4 w-4" />}
          label="Amount"
          value={formatGHS(order.amount)}
        />
        <DetailRow
          icon={<RefreshCcw className="h-4 w-4" />}
          label="Payment Status"
          value={<PaymentStatusBadge status={order.paymentStatus} />}
        />
        <DetailRow
          icon={<Package className="h-4 w-4" />}
          label="Fulfillment Status"
          value={<FulfillmentStatusBadge status={order.fulfillmentStatus} />}
        />
        <DetailRow
          icon={<CalendarClock className="h-4 w-4" />}
          label="Created"
          value={formatDate(order.createdAt, {
            month: "short",
            day: "numeric",
            year: "numeric",
            hour: "numeric",
            minute: "2-digit",
          })}
        />
        <DetailRow
          icon={<CalendarClock className="h-4 w-4" />}
          label="Last Updated"
          value={formatDate(order.updatedAt, {
            month: "short",
            day: "numeric",
            year: "numeric",
            hour: "numeric",
            minute: "2-digit",
          })}
        />
      </div>
    </div>
  );
}

// ─── Row sub-component ────────────────────────────────────────────────────────

interface DetailRowProps {
  icon: React.ReactNode;
  label: string;
  value: React.ReactNode;
  mono?: boolean;
}

function DetailRow({ icon, label, value, mono }: DetailRowProps) {
  return (
    <div className="flex items-center gap-3 px-5 py-3.5">
      <span className="shrink-0 text-muted-foreground">{icon}</span>
      <span className="flex-1 text-sm text-muted-foreground">{label}</span>
      <span
        className={cn(
          "text-sm font-medium text-foreground text-right",
          mono && "font-mono text-xs font-bold text-brand"
        )}
      >
        {value}
      </span>
    </div>
  );
}
