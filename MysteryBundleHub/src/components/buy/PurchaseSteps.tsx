"use client";

import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import type { PurchaseStep } from "@/types/bundle";

const STEPS: { id: PurchaseStep; label: string }[] = [
  { id: 1, label: "Network" },
  { id: 2, label: "Bundle" },
  { id: 3, label: "Phone" },
  { id: 4, label: "Review" },
];

interface PurchaseStepsProps {
  currentStep: PurchaseStep;
  className?: string;
}

export function PurchaseSteps({ currentStep, className }: PurchaseStepsProps) {
  return (
    <nav aria-label="Purchase steps" className={cn("flex items-start", className)}>
      {STEPS.map((step, idx) => {
        const isCompleted = step.id < currentStep;
        const isActive = step.id === currentStep;
        const isLast = idx === STEPS.length - 1;

        return (
          <div key={step.id} className="flex flex-1 items-start min-w-0">
            {/* Step indicator + label */}
            <div className="flex flex-col items-center gap-1.5 shrink-0">
              <div
                aria-current={isActive ? "step" : undefined}
                className={cn(
                  "flex h-8 w-8 items-center justify-center rounded-full border-2 text-xs font-bold transition-all duration-300",
                  isCompleted &&
                    "border-brand bg-brand text-black shadow-[0_0_12px_rgba(24,201,100,0.4)]",
                  isActive &&
                    "border-brand bg-brand/15 text-brand shadow-[0_0_16px_rgba(24,201,100,0.25)]",
                  !isCompleted &&
                    !isActive &&
                    "border-border bg-muted text-muted-foreground"
                )}
              >
                {isCompleted ? (
                  <Check className="h-4 w-4" aria-hidden />
                ) : (
                  step.id
                )}
              </div>

              <span
                className={cn(
                  "text-[10px] font-semibold uppercase tracking-wide whitespace-nowrap leading-none",
                  isActive && "text-brand",
                  isCompleted && "text-foreground",
                  !isCompleted && !isActive && "text-muted-foreground"
                )}
              >
                {step.label}
              </span>
            </div>

            {/* Connector */}
            {!isLast && (
              <div
                aria-hidden
                className={cn(
                  "flex-1 h-0.5 mx-2 mt-4 rounded-full transition-all duration-500",
                  step.id < currentStep ? "bg-brand" : "bg-border"
                )}
              />
            )}
          </div>
        );
      })}
    </nav>
  );
}
