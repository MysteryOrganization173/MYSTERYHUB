"use client";

import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import type { NetworkId, NetworkOption } from "@/types/bundle";

interface NetworkSelectorProps {
  networks: NetworkOption[];
  selected: NetworkId | null;
  onSelect: (id: NetworkId) => void;
  className?: string;
}

export function NetworkSelector({
  networks,
  selected,
  onSelect,
  className,
}: NetworkSelectorProps) {
  return (
    <div className={cn("grid grid-cols-2 gap-3", className)}>
      {networks.map((network) => {
        const isSelected = selected === network.id;

        return (
          <button
            key={network.id}
            type="button"
            onClick={() => network.available && onSelect(network.id)}
            disabled={!network.available}
            aria-pressed={isSelected}
            aria-label={`${network.name} — ${network.description}`}
            className={cn(
              "relative flex flex-col items-center gap-3 rounded-xl border p-4 text-center",
              "transition-all duration-200 tap-none",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-background",
              network.available
                ? "cursor-pointer active:scale-[0.97]"
                : "cursor-not-allowed opacity-40",
              isSelected
                ? "border-brand bg-brand/8 shadow-[0_0_20px_rgba(24,201,100,0.15)]"
                : "border-border bg-card hover:border-brand/30 hover:bg-secondary/40"
            )}
          >
            {/* Selected badge */}
            {isSelected && (
              <span
                aria-hidden
                className="absolute right-2.5 top-2.5 flex h-5 w-5 items-center justify-center rounded-full bg-brand"
              >
                <Check className="h-3 w-3 text-black" strokeWidth={3} />
              </span>
            )}

            {/* Network monogram badge */}
            <div
              className="flex h-14 w-14 items-center justify-center rounded-2xl text-base font-black tracking-tight shadow-sm transition-transform duration-200"
              style={{
                backgroundColor: `${network.color}1A`,
                border: `2px solid ${network.color}50`,
                color: network.color,
              }}
            >
              {network.shortName.slice(0, 2)}
            </div>

            {/* Name + description */}
            <div className="space-y-0.5">
              <p
                className={cn(
                  "text-sm font-semibold leading-tight",
                  isSelected ? "text-brand" : "text-foreground"
                )}
              >
                {network.name}
              </p>
              <p className="text-[11px] text-muted-foreground leading-snug">
                {network.description}
              </p>
            </div>

            {!network.available && (
              <span className="mt-auto text-[9px] font-semibold uppercase tracking-widest text-muted-foreground border border-border rounded px-1.5 py-0.5">
                Coming Soon
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
