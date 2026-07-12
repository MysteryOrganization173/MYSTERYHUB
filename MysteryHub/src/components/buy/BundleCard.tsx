"use client";

import { Check, Clock, Shield, ShieldOff } from "lucide-react";
import { cn, formatGHS } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import type { DataBundle, NetworkOption } from "@/types/bundle";

interface BundleCardProps {
  bundle: DataBundle;
  network: NetworkOption;
  selected: boolean;
  onSelect: () => void;
  className?: string;
}

export function BundleCard({
  bundle,
  network,
  selected,
  onSelect,
  className,
}: BundleCardProps) {
  return (
    <button
      type="button"
      onClick={() => bundle.available && onSelect()}
      disabled={!bundle.available}
      aria-pressed={selected}
      aria-label={`${bundle.volume} — ${formatGHS(bundle.price)}, ${bundle.deliveryTime} delivery`}
      className={cn(
        "relative flex w-full flex-col gap-3 rounded-xl border p-4 text-left",
        "transition-all duration-200 tap-none",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        bundle.available
          ? "cursor-pointer active:scale-[0.98]"
          : "cursor-not-allowed opacity-40",
        selected
          ? "border-brand bg-brand/6 shadow-[0_0_20px_rgba(24,201,100,0.15)]"
          : "border-border bg-card hover:border-brand/25 hover:bg-secondary/30",
        className
      )}
    >
      {/* ── Top row: badges + check ── */}
      <div className="flex items-start justify-between gap-2 min-h-[20px]">
        <div className="flex flex-wrap gap-1.5">
          {bundle.popular && (
            <Badge
              variant="outline"
              className="border-brand/40 bg-brand/10 text-brand text-[10px] px-2 py-0.5 font-semibold h-auto"
            >
              Popular
            </Badge>
          )}
          {bundle.bestValue && (
            <Badge
              variant="outline"
              className="border-yellow-500/40 bg-yellow-500/10 text-yellow-400 text-[10px] px-2 py-0.5 font-semibold h-auto"
            >
              Best Value
            </Badge>
          )}
        </div>

        {selected && (
          <span
            aria-hidden
            className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand"
          >
            <Check className="h-3 w-3 text-black" strokeWidth={3} />
          </span>
        )}
      </div>

      {/* ── Volume + Price ── */}
      <div className="flex items-end justify-between gap-2">
        <div className="min-w-0">
          <div
            className="text-4xl font-black leading-none tracking-tighter"
            style={{ color: network.color }}
          >
            {bundle.volume}
          </div>
          <div className="mt-1 text-[11px] text-muted-foreground leading-tight line-clamp-2">
            {bundle.description}
          </div>
        </div>

        <div className="shrink-0 text-right">
          <div className="text-2xl font-bold text-foreground leading-none">
            {formatGHS(bundle.price)}
          </div>
        </div>
      </div>

      {/* ── Meta row ── */}
      <div className="flex items-center gap-3 border-t border-border/40 pt-2.5">
        <span className="flex items-center gap-1 text-[11px] text-muted-foreground">
          <Clock className="h-3 w-3 shrink-0" aria-hidden />
          {bundle.deliveryTime}
        </span>

        <span
          className={cn(
            "flex items-center gap-1 text-[11px]",
            bundle.shieldProtection ? "text-brand" : "text-muted-foreground"
          )}
        >
          {bundle.shieldProtection ? (
            <Shield className="h-3 w-3 shrink-0" aria-hidden />
          ) : (
            <ShieldOff className="h-3 w-3 shrink-0" aria-hidden />
          )}
          {bundle.shieldProtection ? "Shield On" : "No Shield"}
        </span>
      </div>
    </button>
  );
}
