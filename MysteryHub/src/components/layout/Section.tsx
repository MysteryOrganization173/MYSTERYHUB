import * as React from "react";
import { cn } from "@/lib/utils";

type SectionSize = "sm" | "md" | "lg";

interface SectionProps extends React.HTMLAttributes<HTMLElement> {
  children: React.ReactNode;
  className?: string;
  /** Controls vertical spacing */
  size?: SectionSize;
  /** Apply the container max-width and horizontal padding inside the section */
  contained?: boolean;
  /** Semantic element override */
  as?: "section" | "div" | "article";
}

const sizeMap: Record<SectionSize, string> = {
  sm: "py-10 sm:py-12",
  md: "py-14 sm:py-16 lg:py-20",
  lg: "py-16 sm:py-20 lg:py-28",
};

/**
 * Section — semantic page section with consistent vertical rhythm.
 */
export function Section({
  children,
  className,
  size = "md",
  contained = true,
  as: Tag = "section",
  ...props
}: SectionProps) {
  return (
    <Tag
      className={cn(sizeMap[size], className)}
      {...props}
    >
      {contained ? (
        <div className="container-padded">{children}</div>
      ) : (
        children
      )}
    </Tag>
  );
}
