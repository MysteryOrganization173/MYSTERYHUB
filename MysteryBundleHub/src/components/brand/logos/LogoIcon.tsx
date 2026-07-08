/**
 * LogoIcon — Mystery Hub icon-only logomark.
 *
 * A rounded-square badge with a stylised "M" letterform.
 * Replace the SVG paths when the final brand asset is ready;
 * the component API will not change.
 *
 * @placeholder — swap <rect> fill and <path> data with production SVG.
 */

import { cn } from "@/lib/utils";
import { LOGO_SIZE_PX } from "@/config/brand";
import type { LogoIconProps, LogoSize } from "@/types/brand";

const SIZE_MAP: Record<LogoSize, number> = LOGO_SIZE_PX;

export function LogoIcon({
  size = "md",
  animated = false,
  className,
}: LogoIconProps) {
  const px = typeof size === "number" ? size : SIZE_MAP[size as LogoSize];

  return (
    <svg
      width={px}
      height={px}
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className={cn(
        "shrink-0 select-none",
        animated && "animate-pulse-green",
        className
      )}
    >
      {/* ── Background shape — replace with production SVG ── */}
      <rect width="40" height="40" rx="10" fill="#18C964" />

      {/* ── Stylised "M" letterform — replace with production SVG ── */}
      <path
        d="M8.5 28.5V11.5L20 20.5L31.5 11.5V28.5"
        stroke="white"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
