import * as React from "react";
import { cn } from "@/lib/utils";

// ─── Grid ─────────────────────────────────────────────────────────────────────

type GridCols = 1 | 2 | 3 | 4 | 5 | 6;
type GapSize = "sm" | "md" | "lg" | "xl";

interface GridProps {
  children: React.ReactNode;
  className?: string;
  /** Number of columns on desktop (auto-responsive) */
  cols?: GridCols;
  gap?: GapSize;
}

const colsMap: Record<GridCols, string> = {
  1: "grid-cols-1",
  2: "grid-cols-1 sm:grid-cols-2",
  3: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
  4: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4",
  5: "grid-cols-2 sm:grid-cols-3 lg:grid-cols-5",
  6: "grid-cols-2 sm:grid-cols-3 lg:grid-cols-6",
};

const gapMap: Record<GapSize, string> = {
  sm: "gap-3",
  md: "gap-4 sm:gap-6",
  lg: "gap-5 sm:gap-7 lg:gap-8",
  xl: "gap-6 sm:gap-8 lg:gap-10",
};

/**
 * Grid — responsive CSS grid wrapper.
 */
export function Grid({
  children,
  className,
  cols = 3,
  gap = "md",
}: GridProps) {
  return (
    <div className={cn("grid", colsMap[cols], gapMap[gap], className)}>
      {children}
    </div>
  );
}

// ─── Stack ────────────────────────────────────────────────────────────────────

type StackDirection = "col" | "row";
type StackAlign = "start" | "center" | "end" | "stretch" | "between";

interface StackProps {
  children: React.ReactNode;
  className?: string;
  direction?: StackDirection;
  gap?: GapSize;
  align?: StackAlign;
  wrap?: boolean;
}

const alignMap: Record<StackAlign, string> = {
  start:   "items-start",
  center:  "items-center",
  end:     "items-end",
  stretch: "items-stretch",
  between: "justify-between",
};

/**
 * Stack — flex container for vertical or horizontal stacking.
 */
export function Stack({
  children,
  className,
  direction = "col",
  gap = "md",
  align = "start",
  wrap = false,
}: StackProps) {
  return (
    <div
      className={cn(
        "flex",
        direction === "col" ? "flex-col" : "flex-row",
        gapMap[gap],
        alignMap[align],
        wrap && "flex-wrap",
        className
      )}
    >
      {children}
    </div>
  );
}

// ─── ResponsiveCardGrid ───────────────────────────────────────────────────────

interface ResponsiveCardGridProps {
  children: React.ReactNode;
  className?: string;
  /** Minimum card width before wrapping */
  minCardWidth?: string;
}

/**
 * ResponsiveCardGrid — auto-fill grid that adapts to available width.
 * Cards maintain a minimum width and stretch to fill the container.
 */
export function ResponsiveCardGrid({
  children,
  className,
  minCardWidth = "280px",
}: ResponsiveCardGridProps) {
  return (
    <div
      className={cn("grid gap-4 sm:gap-6", className)}
      style={{
        gridTemplateColumns: `repeat(auto-fill, minmax(${minCardWidth}, 1fr))`,
      }}
    >
      {children}
    </div>
  );
}
