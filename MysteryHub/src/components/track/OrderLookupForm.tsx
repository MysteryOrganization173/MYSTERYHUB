"use client";

/**
 * OrderLookupForm — Mystery Hub V1 Phase 4 (Order Tracking).
 *
 * Reusable reference-input form. Mobile-first: input and button stack on
 * small screens, sit side-by-side from `sm:` up — same breakpoint
 * convention `BuyFlow.tsx`'s success screen already uses for its two
 * action buttons.
 */
import { useState, type FormEvent } from "react";
import { Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface OrderLookupFormProps {
  /** Prefills the input — used for the `?ref=` deep link from BuyFlow's
   * "Track Order" button. */
  initialValue?: string;
  isLoading?: boolean;
  onSubmit: (reference: string) => void;
  className?: string;
}

export function OrderLookupForm({
  initialValue = "",
  isLoading = false,
  onSubmit,
  className,
}: OrderLookupFormProps) {
  const [value, setValue] = useState(initialValue);

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const trimmed = value.trim();
    if (!trimmed) return;
    onSubmit(trimmed);
  }

  return (
    <form onSubmit={handleSubmit} className={cn("space-y-2", className)}>
      <Label htmlFor="order-reference" className="text-sm text-foreground">
        Order reference
      </Label>
      <div className="flex flex-col gap-2 sm:flex-row">
        <Input
          id="order-reference"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="e.g. MH-8F2K3P-LX9QZ1WF"
          autoComplete="off"
          autoCapitalize="characters"
          className="h-11 flex-1 rounded-lg font-mono text-sm"
        />
        <Button
          type="submit"
          variant="brand"
          size="lg"
          loading={isLoading}
          disabled={isLoading || value.trim().length === 0}
          className="gap-2 rounded-lg sm:w-auto"
        >
          {!isLoading && <Search className="h-4 w-4" aria-hidden />}
          Track Order
        </Button>
      </div>
      <p className="text-xs text-muted-foreground">
        Find your reference on the confirmation screen or receipt from your purchase.
      </p>
    </form>
  );
}
