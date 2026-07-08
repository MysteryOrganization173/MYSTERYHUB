/**
 * LoadingBrand — Full loading screen / overlay using the brand logo.
 *
 * Three modes:
 *   fullScreen — fixed inset-0 overlay (e.g. initial app load)
 *   overlay    — absolute inset-0 inside a relative parent (e.g. page transition)
 *   inline     — centred block inside its container (e.g. suspense fallback)
 */

"use client";

import { cn } from "@/lib/utils";
import type { LoadingBrandProps } from "@/types/brand";
import { LogoLoading } from "./logos/LogoLoading";

export function LoadingBrand({
  fullScreen = false,
  overlay    = false,
  message    = "Loading…",
  className,
}: LoadingBrandProps) {
  const isFixed = fullScreen || overlay;

  return (
    <div
      role="status"
      aria-live="polite"
      aria-label={message}
      className={cn(
        "flex items-center justify-center",
        /* Full-screen */
        fullScreen && "fixed inset-0 z-50",
        /* Absolute overlay inside a relative parent */
        overlay && !fullScreen && "absolute inset-0 z-40",
        /* Dark translucent backdrop for overlays */
        isFixed && "bg-background/90 backdrop-blur-sm",
        /* Inline padding when not overlaying */
        !isFixed && "py-16",
        className
      )}
    >
      <LogoLoading
        size={fullScreen ? "xl" : "lg"}
        label={message}
      />
    </div>
  );
}
