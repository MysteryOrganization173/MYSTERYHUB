/**
 * BrandLogo — Smart logo component with variant switching.
 *
 * Renders the correct logo variant based on the `variant` prop:
 *   "main"    → full icon + wordmark (default)
 *   "compact" → icon + "MH" abbreviation
 *   "icon"    → icon-only logomark
 *   "loading" → animated icon for loading states
 *
 * Wraps in a Next.js <Link> when `href` is provided.
 */

import Link from "next/link";
import { cn } from "@/lib/utils";
import type { BrandLogoProps } from "@/types/brand";
import { LogoMain }    from "./logos/LogoMain";
import { LogoCompact } from "./logos/LogoCompact";
import { LogoIcon }    from "./logos/LogoIcon";
import { LogoLoading } from "./logos/LogoLoading";

export function BrandLogo({
  variant     = "main",
  size        = "md",
  showTagline = false,
  href,
  onClick,
  className,
}: BrandLogoProps) {
  const content = (() => {
    switch (variant) {
      case "compact":
        return <LogoCompact size={size} />;
      case "icon":
        return <LogoIcon size={size} />;
      case "loading":
        return <LogoLoading size={size} />;
      case "main":
      default:
        return <LogoMain size={size} showTagline={showTagline} />;
    }
  })();

  if (href) {
    return (
      <Link
        href={href}
        className={cn("inline-flex items-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand rounded", className)}
        onClick={onClick}
        aria-label="Mystery Hub — home"
      >
        {content}
      </Link>
    );
  }

  return (
    <div
      className={cn("inline-flex items-center", className)}
      onClick={onClick}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
    >
      {content}
    </div>
  );
}
