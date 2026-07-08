import * as React from "react";
import { cn } from "@/lib/utils";

type Alignment = "left" | "center" | "right";
type Direction = "row" | "col";

interface CTAButtonGroupProps {
  children: React.ReactNode;
  className?: string;
  align?: Alignment;
  direction?: Direction;
  /** Stack buttons vertically on mobile */
  stackOnMobile?: boolean;
}

const alignMap: Record<Alignment, string> = {
  left:   "justify-start",
  center: "justify-center",
  right:  "justify-end",
};

/**
 * CTAButtonGroup — wrapper for call-to-action button clusters.
 * Handles alignment, spacing, and mobile stacking automatically.
 */
export function CTAButtonGroup({
  children,
  className,
  align = "left",
  direction = "row",
  stackOnMobile = true,
}: CTAButtonGroupProps) {
  return (
    <div
      className={cn(
        "flex gap-3",
        stackOnMobile && direction === "row"
          ? "flex-col sm:flex-row"
          : "flex-row",
        direction === "col" && "flex-col",
        alignMap[align],
        className
      )}
    >
      {children}
    </div>
  );
}
