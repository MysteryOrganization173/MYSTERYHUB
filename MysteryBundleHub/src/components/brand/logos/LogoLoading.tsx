/**
 * LogoLoading — Animated Mystery Hub logo for loading states.
 *
 * Renders the icon with:
 *   • A blurred green glow behind it (slow pulse)
 *   • A thin ring that pings outward once per cycle
 *   • Optional label text that fades in and out
 *
 * Uses only Tailwind CSS animations — no framer-motion dependency.
 */

"use client";

import { cn } from "@/lib/utils";
import type { LogoLoadingProps, LogoSize } from "@/types/brand";
import { LogoIcon } from "./LogoIcon";

const RING_RADIUS: Record<LogoSize, string> = {
  xs: "rounded-lg",
  sm: "rounded-xl",
  md: "rounded-xl",
  lg: "rounded-2xl",
  xl: "rounded-2xl",
};

export function LogoLoading({
  size = "lg",
  label,
  className,
}: LogoLoadingProps) {
  const ring = RING_RADIUS[size];

  return (
    <div
      className={cn("inline-flex flex-col items-center gap-4", className)}
      role="status"
      aria-label={label ?? "Loading"}
    >
      {/* ── Icon with layered animation rings ── */}
      <div className="relative inline-flex items-center justify-center">
        {/* Outer glow — slow pulse */}
        <span
          aria-hidden="true"
          className={cn(
            "absolute inset-0 bg-brand/25 blur-md",
            ring,
            "animate-pulse"
          )}
          style={{ animationDuration: "2s" }}
        />

        {/* Ping ring */}
        <span
          aria-hidden="true"
          className={cn(
            "absolute -inset-1 border border-brand/40",
            ring,
            "animate-ping"
          )}
          style={{ animationDuration: "1.6s" }}
        />

        {/* Icon itself */}
        <div className="relative z-10">
          <LogoIcon size={size} />
        </div>
      </div>

      {/* ── Optional label ── */}
      {label && (
        <p className="text-sm text-muted-foreground animate-pulse select-none">
          {label}
        </p>
      )}
    </div>
  );
}
