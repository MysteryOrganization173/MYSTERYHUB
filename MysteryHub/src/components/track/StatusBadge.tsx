/**
 * StatusBadge — Mystery Hub V1 Phase 4 (Order Tracking).
 *
 * Generic status pill built on the existing `Badge` primitive
 * (src/components/ui/badge.tsx) — this file owns the domain-specific
 * label/tone mapping so `ui/badge.tsx` itself stays free of business logic,
 * per docs/ARCHITECTURE.md's "Never add business logic here" rule for
 * `components/ui/`.
 *
 * Two reusable, ready-to-use badges are exported for the two independent
 * order status columns (see docs/payment-flow.md — payment and
 * fulfillment are tracked separately): `PaymentStatusBadge` and
 * `FulfillmentStatusBadge`.
 */
import { cn } from "@/lib/utils";
import { Badge, type BadgeProps } from "@/components/ui/badge";
import type { OrderPaymentStatus, OrderFulfillmentStatus } from "@/types/order";

export type StatusTone = "success" | "pending" | "processing" | "failed" | "muted";

const TONE_VARIANT: Record<StatusTone, BadgeProps["variant"]> = {
  success: "brand-solid",
  pending: "outline",
  processing: "brand",
  failed: "destructive",
  muted: "muted",
};

interface StatusBadgeProps {
  tone: StatusTone;
  label: string;
  className?: string;
}

/** Generic status pill — pick a `tone`, provide a `label`. Used directly by
 * `OrderStatusTimeline` for its stage markers, and indirectly by
 * `PaymentStatusBadge`/`FulfillmentStatusBadge` below. */
export function StatusBadge({ tone, label, className }: StatusBadgeProps) {
  return (
    <Badge variant={TONE_VARIANT[tone]} className={cn("font-semibold", className)}>
      {label}
    </Badge>
  );
}

const PAYMENT_STATUS_MAP: Record<OrderPaymentStatus, { label: string; tone: StatusTone }> = {
  pending: { label: "Payment Pending", tone: "pending" },
  paid: { label: "Paid", tone: "success" },
  failed: { label: "Payment Failed", tone: "failed" },
  refunded: { label: "Refunded", tone: "muted" },
};

const FULFILLMENT_STATUS_MAP: Record<
  OrderFulfillmentStatus,
  { label: string; tone: StatusTone }
> = {
  pending: { label: "Awaiting Fulfillment", tone: "pending" },
  processing: { label: "Processing", tone: "processing" },
  delivered: { label: "Delivered", tone: "success" },
  failed: { label: "Delivery Failed", tone: "failed" },
};

export function PaymentStatusBadge({
  status,
  className,
}: {
  status: OrderPaymentStatus;
  className?: string;
}) {
  const { label, tone } = PAYMENT_STATUS_MAP[status];
  return <StatusBadge tone={tone} label={label} className={className} />;
}

export function FulfillmentStatusBadge({
  status,
  className,
}: {
  status: OrderFulfillmentStatus;
  className?: string;
}) {
  const { label, tone } = FULFILLMENT_STATUS_MAP[status];
  return <StatusBadge tone={tone} label={label} className={className} />;
}
