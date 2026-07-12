import Link from "next/link";
import { ScanLine, ArrowRight, GraduationCap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Section } from "@/components/layout";

// ─── Section ──────────────────────────────────────────────────────────────────

export function CheckerBanner() {
  return (
    <Section
      size="sm"
      aria-labelledby="checker-heading"
      className="bg-secondary/40 border-y border-border/50"
    >
      <div className="flex flex-col sm:flex-row items-center justify-between gap-6">

        {/* Left: icon + copy */}
        <div className="flex flex-col sm:flex-row items-center gap-5 text-center sm:text-left">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-500/10 border border-blue-500/20 shrink-0">
            <GraduationCap className="h-7 w-7 text-blue-400" aria-hidden />
          </div>

          <div>
            <div className="flex items-center gap-2 justify-center sm:justify-start mb-1">
              <h2
                id="checker-heading"
                className="text-lg font-bold text-foreground"
              >
                Results Checker
              </h2>
              <Badge variant="brand" className="text-[10px] font-bold">
                Available
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground max-w-md leading-relaxed">
              Check WAEC, BECE, and other national examination results instantly.
              Fast, accurate, and secure.
            </p>
          </div>
        </div>

        {/* Right: CTA */}
        <Button
          asChild
          variant="outline-brand"
          className="rounded-xl gap-2 shrink-0 w-full sm:w-auto"
        >
          <Link href="/checker">
            <ScanLine className="h-4 w-4" aria-hidden />
            Check Results
            <ArrowRight className="h-4 w-4" aria-hidden />
          </Link>
        </Button>
      </div>
    </Section>
  );
}
