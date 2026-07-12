/**
 * LogoCompact — Minimal Mystery Hub logo for tight spaces.
 *
 * Layout: [Icon] MH
 * Used in: mobile nav headers, breadcrumbs, compact sidebar states.
 *
 * @placeholder — icon SVG will be swapped via LogoIcon when the production
 *   asset is ready.
 */

import { cn } from "@/lib/utils";
import type { LogoCompactProps, LogoSize } from "@/types/brand";
import { LogoIcon } from "./LogoIcon";

const TEXT_SIZE: Record<LogoSize, string> = {
  xs: "text-xs  font-semibold",
  sm: "text-sm  font-semibold",
  md: "text-base font-semibold",
  lg: "text-lg  font-semibold",
  xl: "text-xl  font-semibold",
};

const GAP: Record<LogoSize, string> = {
  xs: "gap-1.5",
  sm: "gap-2",
  md: "gap-2.5",
  lg: "gap-3",
  xl: "gap-3",
};

export function LogoCompact({ size = "sm", className }: LogoCompactProps) {
  return (
    <div className={cn("inline-flex items-center", GAP[size], className)}>
      <LogoIcon size={size} />
      <span className={cn(TEXT_SIZE[size], "tracking-tight text-foreground")}>
        M<span className="text-brand">H</span>
      </span>
    </div>
  );
}
