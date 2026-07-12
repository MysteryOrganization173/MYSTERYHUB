/**
 * OrderStatusTimeline — Mystery Hub V1 Phase 4 (Order Tracking).
 *
 * Reusable, presentation-only stepper for the four-stage purchase journey:
 *
 *   Order Created -> Payment Received -> Processing -> Delivered
 *
 * Derives every stage's visual state purely from the two independent order
 * status columns (`payment_status` / `fulfillment_status` — see
 * docs/payment-flow.md and the migration comments in
 * supabase/migrations/0001_init_profiles_and_orders.sql). No network calls,
 * no SuccessBizHub — this component only renders whatever `OrderRecord` it
 * is given. Vertical layout by construction, so it needs no
 * breakpoint-specific logic to stay mobile-first.
 *
 * Failure handling: a failed payment or a failed fulfillment "halts" the
 * timeline — the stage where the failure occurred renders as `"failed"`,
 * and every stage after it renders as `"upcoming"` rather than implying
 * progress that didn't happen. A refunded payment halts the same way with
 * a neutral `"muted"` tone instead of an alarming one.
 */
import { CheckCircle2, CircleDot, Circle, XCircle, MinusCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { ROUTES } from "@/constants";
import type { OrderPaymentStatus, OrderFulfillmentStatus } from "@/types/order";

type StageState = "complete" | "current" | "upcoming" | "failed" | "muted";

interface Stage {
  key: string;
  title: string;
  description: string;
  state: StageState;
}

function computeStages(
  paymentStatus: OrderPaymentStatus,
  fulfillmentStatus: OrderFulfillmentStatus
): Stage[] {
  // ── Stage 1: Order Created — always reached once an order record exists.
  const orderCreated: Stage = {
    key: "order-created",
    title: "Order Created",
    description: "Your order was received and saved.",
    state: "complete",
  };

  // ── Stage 2: Payment ─────────────────────────────────────────────────────
  let payment: Stage;
  let halted = false;

  if (paymentStatus === "paid") {
    payment = {
      key: "payment",
      title: "Payment Received",
      description: "Your payment was confirmed by Paystack.",
      state: "complete",
    };
  } else if (paymentStatus === "failed") {
    payment = {
      key: "payment",
      title: "Payment Failed",
      description: "The payment attempt didn't go through. Try purchasing again, or contact support if you were charged.",
      state: "failed",
    };
    halted = true;
  } else if (paymentStatus === "refunded") {
    payment = {
      key: "payment",
      title: "Refunded",
      description: "This order was refunded — no further fulfillment will happen.",
      state: "muted",
    };
    halted = true;
  } else {
    payment = {
      key: "payment",
      title: "Awaiting Payment",
      description: "Waiting for payment confirmation.",
      state: "current",
    };
    halted = true; // fulfillment can't start before payment
  }

  // ── Stage 3: Processing ──────────────────────────────────────────────────
  let processing: Stage;
  if (halted) {
    processing = {
      key: "processing",
      title: "Processing",
      description: "Not started yet.",
      state: "upcoming",
    };
  } else if (fulfillmentStatus === "failed") {
    processing = {
      key: "processing",
      title: "Delivery Failed",
      description: "Fulfillment couldn't be completed. Our support team can help — see below.",
      state: "failed",
    };
    halted = true;
  } else if (fulfillmentStatus === "delivered") {
    processing = {
      key: "processing",
      title: "Processing",
      description: "Your order was processed.",
      state: "complete",
    };
  } else if (fulfillmentStatus === "processing") {
    processing = {
      key: "processing",
      title: "Processing",
      description: "Your package is being delivered now.",
      state: "current",
    };
  } else {
    // fulfillmentStatus === "pending", payment already confirmed
    processing = {
      key: "processing",
      title: "Processing",
      description: "Payment confirmed — fulfillment starts shortly.",
      state: "current",
    };
  }

  // ── Stage 4: Delivered ───────────────────────────────────────────────────
  const delivered: Stage = {
    key: "delivered",
    title: "Delivered",
    description:
      fulfillmentStatus === "delivered"
        ? "Your package has been delivered."
        : "Not delivered yet.",
    state: fulfillmentStatus === "delivered" && !halted ? "complete" : "upcoming",
  };

  return [orderCreated, payment, processing, delivered];
}

const STATE_ICON: Record<StageState, typeof CheckCircle2> = {
  complete: CheckCircle2,
  current: CircleDot,
  upcoming: Circle,
  failed: XCircle,
  muted: MinusCircle,
};

const STATE_ICON_CLASS: Record<StageState, string> = {
  complete: "text-brand",
  current: "text-brand animate-pulse",
  upcoming: "text-muted-foreground/40",
  failed: "text-destructive",
  muted: "text-muted-foreground",
};

const STATE_LINE_CLASS: Record<StageState, string> = {
  complete: "bg-brand",
  current: "bg-brand/40",
  upcoming: "bg-border",
  failed: "bg-destructive/40",
  muted: "bg-border",
};

interface OrderStatusTimelineProps {
  paymentStatus: OrderPaymentStatus;
  fulfillmentStatus: OrderFulfillmentStatus;
  className?: string;
}

export function OrderStatusTimeline({
  paymentStatus,
  fulfillmentStatus,
  className,
}: OrderStatusTimelineProps) {
  const stages = computeStages(paymentStatus, fulfillmentStatus);
  const hasFailure = stages.some((stage) => stage.state === "failed");

  return (
    <div className={cn("space-y-0", className)}>
      {stages.map((stage, index) => {
        const Icon = STATE_ICON[stage.state];
        const isLast = index === stages.length - 1;
        return (
          <div key={stage.key} className="flex gap-3">
            {/* Icon + connecting line */}
            <div className="flex flex-col items-center">
              <Icon
                className={cn("h-5 w-5 shrink-0", STATE_ICON_CLASS[stage.state])}
                aria-hidden
              />
              {!isLast && (
                <span
                  className={cn("w-0.5 flex-1 my-1", STATE_LINE_CLASS[stage.state])}
                  aria-hidden
                />
              )}
            </div>

            {/* Text */}
            <div className={cn("min-w-0 pb-6", isLast && "pb-0")}>
              <p
                className={cn(
                  "text-sm font-semibold",
                  stage.state === "upcoming"
                    ? "text-muted-foreground/70"
                    : stage.state === "failed"
                      ? "text-destructive"
                      : "text-foreground"
                )}
              >
                {stage.title}
              </p>
              <p className="mt-0.5 text-xs text-muted-foreground leading-relaxed">
                {stage.description}
              </p>
            </div>
          </div>
        );
      })}

      {hasFailure && (
        <p className="mt-2 text-xs text-muted-foreground">
          Need help?{" "}
          <a href={ROUTES.support} className="font-medium text-brand hover:text-brand/80">
            Contact support
          </a>{" "}
          with your order reference.
        </p>
      )}
    </div>
  );
}
