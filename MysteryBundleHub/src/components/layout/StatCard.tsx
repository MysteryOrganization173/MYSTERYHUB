import * as React from "react";
import { cn } from "@/lib/utils";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

type TrendDirection = "up" | "down" | "neutral";

export interface StatCardTrend {
  direction: TrendDirection;
  label: string;
}

export interface StatCardProps {
  /** The main numeric or text value */
  value: string;
  /** Label shown below the value */
  label: string;
  /** Optional icon to display */
  icon?: React.ReactNode;
  /** Optional trend indicator */
  trend?: StatCardTrend;
  /** Optional click handler */
  onClick?: () => void;
  className?: string;
}

const trendIcons: Record<TrendDirection, React.ElementType> = {
  up:      TrendingUp,
  down:    TrendingDown,
  neutral: Minus,
};

const trendColors: Record<TrendDirection, string> = {
  up:      "text-green-400",
  down:    "text-red-400",
  neutral: "text-muted-foreground",
};

function TrendBadge({ trend }: { trend: StatCardTrend }) {
  const Icon = trendIcons[trend.direction];
  const colorClass = trendColors[trend.direction];
  return (
    <div className={cn("flex items-center gap-1 text-xs font-medium", colorClass)}>
      <Icon className="h-3 w-3" aria-hidden />
      <span>{trend.label}</span>
    </div>
  );
}

/**
 * StatCard — displays a key metric with optional icon and trend indicator.
 * Used in dashboards, hero sections, and analytics overviews.
 */
export function StatCard({
  value,
  label,
  icon,
  trend,
  onClick,
  className,
}: StatCardProps) {
  const isInteractive = Boolean(onClick);

  return (
    <div
      role={isInteractive ? "button" : undefined}
      tabIndex={isInteractive ? 0 : undefined}
      onClick={onClick}
      onKeyDown={isInteractive ? (e) => { if (e.key === "Enter" || e.key === " ") onClick?.(); } : undefined}
      className={cn(
        "stat-card",
        isInteractive && "cursor-pointer hover:-translate-y-0.5 transition-transform duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        className
      )}
    >
      {/* Header row: label + optional icon */}
      <div className="flex items-center justify-between">
        <span className="stat-label">{label}</span>
        {icon && (
          <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-border/50 bg-secondary text-muted-foreground">
            {icon}
          </div>
        )}
      </div>

      {/* Value */}
      <span className="stat-value mt-1">{value}</span>

      {/* Trend */}
      {trend && <TrendBadge trend={trend} />}
    </div>
  );
}

// ─── StatGrid ─────────────────────────────────────────────────────────────────

interface StatGridProps {
  stats: StatCardProps[];
  className?: string;
}

/**
 * StatGrid — responsive grid of StatCard components.
 */
export function StatGrid({ stats, className }: StatGridProps) {
  return (
    <div
      className={cn(
        "grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4",
        className
      )}
    >
      {stats.map((stat, i) => (
        <StatCard key={i} {...stat} />
      ))}
    </div>
  );
}
