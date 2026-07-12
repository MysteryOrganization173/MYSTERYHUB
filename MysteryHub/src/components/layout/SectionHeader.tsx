import * as React from "react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

interface SectionHeaderProps {
  /** Small badge above the title */
  badge?: string;
  title: string;
  description?: string;
  /** Center-align the header (default true) */
  centered?: boolean;
  className?: string;
  titleClassName?: string;
  descriptionClassName?: string;
}

/**
 * SectionHeader — consistent heading block for every content section.
 * Supports a badge label, title, and optional description.
 */
export function SectionHeader({
  badge,
  title,
  description,
  centered = true,
  className,
  titleClassName,
  descriptionClassName,
}: SectionHeaderProps) {
  return (
    <div
      className={cn(
        "mb-10 md:mb-14 max-w-2xl",
        centered && "mx-auto text-center",
        className
      )}
    >
      {badge && (
        <Badge
          variant="outline"
          className="mb-4 border-brand/30 bg-brand/8 text-brand text-xs font-semibold tracking-wide uppercase px-3 py-1"
        >
          {badge}
        </Badge>
      )}

      <h2
        className={cn(
          "section-title",
          badge && "mt-2",
          titleClassName
        )}
      >
        {title}
      </h2>

      {description && (
        <p
          className={cn(
            "mt-4 section-description",
            centered && "mx-auto",
            descriptionClassName
          )}
        >
          {description}
        </p>
      )}
    </div>
  );
}

/**
 * SectionDescription — standalone description for section headers.
 */
export function SectionDescription({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <p className={cn("section-description max-w-xl", className)}>
      {children}
    </p>
  );
}
