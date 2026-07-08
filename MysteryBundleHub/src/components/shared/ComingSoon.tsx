import * as React from "react";
import { cn } from "@/lib/utils";

interface ComingSoonProps {
  icon?: React.ReactNode;
  title?: string;
  description?: string;
  className?: string;
}

/**
 * ComingSoon — placeholder state for routes under construction.
 * Replace with real content when the page is built.
 */
export function ComingSoon({
  icon,
  title = "This page is being built",
  description = "We're working on something great. Check back soon.",
  className,
}: ComingSoonProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center text-center py-20 px-4 gap-5",
        className
      )}
    >
      {icon && (
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-brand/20 bg-brand/8">
          {icon}
        </div>
      )}
      <div className="space-y-2">
        <h2 className="text-xl font-semibold text-foreground">{title}</h2>
        <p className="text-muted-foreground max-w-sm mx-auto text-sm leading-relaxed">
          {description}
        </p>
      </div>
      <div className="flex items-center gap-2">
        <span className="h-1.5 w-1.5 rounded-full bg-brand animate-pulse" aria-hidden />
        <span className="text-sm text-brand font-medium">Coming Soon</span>
      </div>
    </div>
  );
}
