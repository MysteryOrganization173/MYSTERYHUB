/**
 * BrandIcon — Standalone icon-only brand element.
 *
 * Wraps LogoIcon with optional pulse glow.
 * Use for avatar slots, loading indicators, favicons, etc.
 */

import { cn } from "@/lib/utils";
import type { BrandIconProps } from "@/types/brand";
import { LogoIcon } from "./logos/LogoIcon";

export function BrandIcon({
  size     = "md",
  animated = false,
  pulse    = false,
  className,
}: BrandIconProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center justify-center shrink-0",
        pulse && "animate-pulse-green rounded-xl",
        className
      )}
      aria-hidden="true"
    >
      <LogoIcon size={size} animated={animated} />
    </span>
  );
}
