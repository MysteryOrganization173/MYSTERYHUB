"use client";

import {
  Wifi,
  Phone,
  Clock,
  Shield,
  ShieldOff,
  ArrowRight,
  Lock,
  Pencil,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import type { DataBundle, NetworkOption } from "@/types/bundle";

interface OrderSummaryProps {
  bundle: DataBundle;
  network: NetworkOption;
  phoneNumber: string;
  onConfirm: () => void;
  onEdit: (step: 1 | 2 | 3) => void;
  isProcessing?: boolean;
  className?: string;
}

export function OrderSummary({
  bundle,
  network,
  phoneNumber,
  onConfirm,
  onEdit,
  isProcessing = false,
  className,
}: OrderSummaryProps) {
  // Format phone for display: strip leading 0, prepend +233
  const displayPhone = `+233 ${phoneNumber.replace(/^0/, "")}`;

  return (
    <div className={cn("space-y-4", className)}>
      {/* ── Receipt card ── */}
      <div className="overflow-hidden rounded-xl border border-border bg-card">
        {/* Card header — network colour strip */}
        <div
          className="flex items-center gap-3 px-5 py-4"
          style={{
            background: `linear-gradient(135deg, ${network.color}18 0%, ${network.color}08 100%)`,
            borderBottom: `1px solid ${network.color}30`,
          }}
        >
          {/* Network monogram */}
          <div
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-sm font-black"
            style={{
              backgroundColor: `${network.color}20`,
              border: `1.5px solid ${network.color}50`,
              color: network.color,
            }}
          >
            {network.shortName.slice(0, 2)}
          </div>

          <div className="min-w-0">
            <p className="font-semibold text-foreground truncate">{bundle.name}</p>
            <p className="text-xs text-muted-foreground">{network.name}</p>
          </div>

          {/* Edit network */}
          <button
            type="button"
            onClick={() => onEdit(1)}
            aria-label="Change network"
            className="ml-auto shrink-0 flex items-center gap-1 text-[11px] text-brand hover:text-brand/80 transition-colors"
          >
            <Pencil className="h-3 w-3" />
            Change
          </button>
        </div>

        {/* Row list */}
        <div className="divide-y divide-border/40">
          <SummaryRow
            icon={<Wifi className="h-4 w-4" />}
            label="Data Volume"
            value={bundle.volume}
            onEdit={() => onEdit(2)}
          />
          <SummaryRow
            icon={<Phone className="h-4 w-4" />}
            label="Phone Number"
            value={displayPhone}
            onEdit={() => onEdit(3)}
          />
          <SummaryRow
            icon={<Clock className="h-4 w-4" />}
            label="Delivery"
            value={bundle.deliveryTime}
          />
          <SummaryRow
            icon={
              bundle.shieldProtection ? (
                <Shield className="h-4 w-4 text-brand" />
              ) : (
                <ShieldOff className="h-4 w-4" />
              )
            }
            label="Shield Protection"
            value={bundle.shieldProtection ? "Enabled" : "Not included"}
            valueClassName={bundle.shieldProtection ? "text-brand" : ""}
          />
        </div>

        {/* Price footer */}
        <div className="flex items-center justify-between bg-muted/30 px-5 py-4">
          <div>
            <p className="text-xs text-muted-foreground">Total Due</p>
            <p className="text-2xl font-black text-foreground tabular-nums">
              ${bundle.price.toFixed(2)}
            </p>
          </div>
          <div className="text-right">
            <p className="text-[11px] text-muted-foreground">
              Shield{" "}
              <span className={bundle.shieldProtection ? "text-brand" : ""}>
                {bundle.shieldProtection ? "✓" : "—"}
              </span>
            </p>
            <p className="text-[11px] text-muted-foreground">
              Delivery: {bundle.deliveryTime}
            </p>
          </div>
        </div>
      </div>

      {/* ── CTA ── */}
      <Button
        type="button"
        onClick={onConfirm}
        variant="brand"
        size="xl"
        loading={isProcessing}
        disabled={isProcessing}
        className="w-full gap-2 rounded-xl text-base"
      >
        {isProcessing ? (
          "Processing order…"
        ) : (
          <>
            <Lock className="h-4 w-4" aria-hidden />
            Confirm Order
            <ArrowRight className="h-4 w-4 ml-0.5" aria-hidden />
          </>
        )}
      </Button>

      <p className="text-center text-[11px] text-muted-foreground leading-relaxed px-4">
        Payment processing coming soon. Your order will be queued and fulfilled
        once payments are live.
      </p>
    </div>
  );
}

// ─── Row sub-component ────────────────────────────────────────────────────────

interface SummaryRowProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  onEdit?: () => void;
  valueClassName?: string;
}

function SummaryRow({
  icon,
  label,
  value,
  onEdit,
  valueClassName,
}: SummaryRowProps) {
  return (
    <div className="flex items-center gap-3 px-5 py-3.5">
      <span className="shrink-0 text-muted-foreground">{icon}</span>
      <span className="flex-1 text-sm text-muted-foreground">{label}</span>
      <span className={cn("text-sm font-medium text-foreground", valueClassName)}>
        {value}
      </span>
      {onEdit && (
        <button
          type="button"
          onClick={onEdit}
          aria-label={`Edit ${label}`}
          className="ml-2 shrink-0 flex items-center gap-0.5 text-[11px] font-medium text-brand hover:text-brand/80 transition-colors"
        >
          <Pencil className="h-2.5 w-2.5" />
          Edit
        </button>
      )}
    </div>
  );
}
