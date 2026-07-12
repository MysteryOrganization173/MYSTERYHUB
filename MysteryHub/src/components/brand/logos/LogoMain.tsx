/**
 * LogoMain — Full Mystery Hub logo (icon + wordmark).
 *
 * Layout: [Icon] MYSTERY <green>Hub</green>
 * Optional tagline line below the wordmark.
 *
 * @placeholder — icon SVG will be swapped via LogoIcon when the production
 *   asset is ready. Font rendering uses system/geist stack until brand fonts land.
 */

import { cn } from "@/lib/utils";
import type { LogoMainProps, LogoSize } from "@/types/brand";
import { LogoIcon } from "./LogoIcon";

interface TextConfig {
  icon:    LogoSize;
  title:   string;
  tagline: string;
  gap:     string;
}

const SIZE_CONFIG: Record<LogoSize, TextConfig> = {
  xs: { icon: "xs", title: "text-sm  font-bold",   tagline: "text-[9px]",   gap: "gap-2"   },
  sm: { icon: "sm", title: "text-base font-bold",  tagline: "text-[10px]",  gap: "gap-2.5" },
  md: { icon: "md", title: "text-xl  font-bold",   tagline: "text-xs",      gap: "gap-3"   },
  lg: { icon: "lg", title: "text-2xl font-bold",   tagline: "text-sm",      gap: "gap-3.5" },
  xl: { icon: "xl", title: "text-3xl font-bold",   tagline: "text-base",    gap: "gap-4"   },
};

export function LogoMain({
  size = "md",
  showTagline = false,
  className,
}: LogoMainProps) {
  const cfg = SIZE_CONFIG[size];

  return (
    <div className={cn("inline-flex items-center", cfg.gap, className)}>
      {/* ── Icon ── */}
      <LogoIcon size={cfg.icon} />

      {/* ── Wordmark ── */}
      <div className="flex flex-col leading-none">
        <span
          className={cn(
            cfg.title,
            "tracking-tight text-foreground whitespace-nowrap"
          )}
        >
          Mystery{" "}
          <span className="text-brand">Hub</span>
        </span>

        {showTagline && (
          <span
            className={cn(
              cfg.tagline,
              "text-muted-foreground mt-0.5 tracking-widest uppercase whitespace-nowrap"
            )}
          >
            Everything Digital. One Trusted Place.
          </span>
        )}
      </div>
    </div>
  );
}
