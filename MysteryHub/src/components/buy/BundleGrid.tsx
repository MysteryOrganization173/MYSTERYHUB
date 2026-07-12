"use client";

import { PackageX } from "lucide-react";
import { cn } from "@/lib/utils";
import type { DataBundle, NetworkOption } from "@/types/bundle";
import { BundleCard } from "./BundleCard";

interface BundleGridProps {
  bundles: DataBundle[];
  network: NetworkOption;
  selectedBundleId: string | null;
  onSelect: (bundle: DataBundle) => void;
  className?: string;
}

export function BundleGrid({
  bundles,
  network,
  selectedBundleId,
  onSelect,
  className,
}: BundleGridProps) {
  if (bundles.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-border bg-muted">
          <PackageX className="h-6 w-6 text-muted-foreground" aria-hidden />
        </div>
        <div>
          <p className="text-sm font-medium text-foreground">No packages available</p>
          <p className="text-xs text-muted-foreground mt-0.5">
            There are no active internet packages for {network.name} right now.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("grid grid-cols-1 gap-3 sm:grid-cols-2", className)}>
      {bundles.map((bundle) => (
        <BundleCard
          key={bundle.id}
          bundle={bundle}
          network={network}
          selected={selectedBundleId === bundle.id}
          onSelect={() => onSelect(bundle)}
        />
      ))}
    </div>
  );
}
