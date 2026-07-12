import * as React from "react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

interface PageHeaderProps {
  /** Small badge label */
  badge?: string;
  title: string;
  description?: string;
  /** Optional action buttons or elements to the right (desktop) or below (mobile) */
  actions?: React.ReactNode;
  className?: string;
}

/**
 * PageHeader — large, prominent heading for top-level pages.
 * Has a two-column layout on desktop: title/description left, actions right.
 */
export function PageHeader({
  badge,
  title,
  description,
  actions,
  className,
}: PageHeaderProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between",
        className
      )}
    >
      <div className="flex-1 min-w-0">
        {badge && (
          <Badge
            variant="outline"
            className="mb-3 border-brand/30 bg-brand/8 text-brand text-xs font-semibold tracking-wide uppercase px-3 py-1"
          >
            {badge}
          </Badge>
        )}

        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
          {title}
        </h1>

        {description && (
          <p className="mt-2 text-base text-muted-foreground leading-relaxed max-w-2xl">
            {description}
          </p>
        )}
      </div>

      {actions && (
        <div className="flex shrink-0 items-center gap-2">
          {actions}
        </div>
      )}
    </div>
  );
}
