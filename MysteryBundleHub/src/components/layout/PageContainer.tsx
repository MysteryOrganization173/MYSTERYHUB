import * as React from "react";
import { cn } from "@/lib/utils";

interface PageContainerProps {
  children: React.ReactNode;
  className?: string;
  /** Remove default vertical padding */
  noPad?: boolean;
  /** Constrain content width to a narrower reading width */
  narrow?: boolean;
}

/**
 * PageContainer — top-level wrapper for every page's main content.
 * Applies horizontal padding + responsive max-width + optional vertical spacing.
 */
export function PageContainer({
  children,
  className,
  noPad = false,
  narrow = false,
}: PageContainerProps) {
  return (
    <div
      className={cn(
        "container-padded w-full",
        !noPad && "py-8 md:py-10 lg:py-12",
        narrow && "max-w-3xl mx-auto",
        className
      )}
    >
      {children}
    </div>
  );
}
