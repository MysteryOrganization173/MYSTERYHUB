import * as React from "react";
import { cn } from "@/lib/utils";

interface FeatureRowProps {
  /** Lucide icon element or any React node */
  icon: React.ReactNode;
  title: string;
  description: string;
  className?: string;
  /** Reverse layout so icon is on the right on desktop */
  reverse?: boolean;
}

/**
 * FeatureRow — horizontal icon + title + description row.
 * Used in feature lists, benefit sections, and how-it-works steps.
 */
export function FeatureRow({
  icon,
  title,
  description,
  className,
  reverse = false,
}: FeatureRowProps) {
  return (
    <div
      className={cn(
        "flex gap-4 items-start",
        reverse && "flex-row-reverse text-right",
        className
      )}
    >
      {/* Icon container */}
      <div className="flex-shrink-0 flex h-10 w-10 items-center justify-center rounded-xl border border-brand/20 bg-brand/8 text-brand">
        {icon}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <h3 className="text-sm font-semibold text-foreground leading-snug">
          {title}
        </h3>
        <p className="mt-1 text-sm text-muted-foreground leading-relaxed">
          {description}
        </p>
      </div>
    </div>
  );
}

// ─── FeatureList ──────────────────────────────────────────────────────────────

interface FeatureItem {
  icon: React.ReactNode;
  title: string;
  description: string;
}

interface FeatureListProps {
  items: FeatureItem[];
  className?: string;
  cols?: 1 | 2;
}

/**
 * FeatureList — grid of FeatureRow items.
 */
export function FeatureList({
  items,
  className,
  cols = 1,
}: FeatureListProps) {
  return (
    <div
      className={cn(
        "grid gap-6",
        cols === 2 ? "grid-cols-1 sm:grid-cols-2" : "grid-cols-1",
        className
      )}
    >
      {items.map((item, i) => (
        <FeatureRow key={i} {...item} />
      ))}
    </div>
  );
}
