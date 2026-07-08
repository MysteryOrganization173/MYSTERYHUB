import Link from "next/link";
import { ArrowRight, Wifi, ShieldCheck, Zap, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CTAButtonGroup } from "@/components/layout";

// ─── Static data ──────────────────────────────────────────────────────────────

const TRUST_ITEMS = [
  { icon: Zap,         label: "Instant Delivery" },
  { icon: ShieldCheck, label: "Secure Payments"  },
  { icon: Star,        label: "Earn Rewards"     },
] as const;

// ─── Section ──────────────────────────────────────────────────────────────────

export function HeroSection() {
  return (
    <section
      aria-labelledby="hero-heading"
      className="relative overflow-hidden bg-background"
    >
      {/* Subtle grid texture */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-grid-subtle opacity-50"
      />
      {/* Radial glow from the top */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 h-[600px] w-[700px] rounded-full bg-brand/5 blur-[130px]"
      />

      <div className="container-padded relative z-10 py-20 sm:py-28 lg:py-32">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">

          {/* ── Content ─────────────────────────────────── */}
          <div className="flex flex-col gap-6 text-center lg:text-left items-center lg:items-start">

            <Badge
              variant="outline"
              className="inline-flex items-center gap-1.5 border-brand/30 bg-brand/10 text-brand text-xs font-semibold tracking-wide px-3 py-1.5 rounded-full"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-brand animate-pulse" aria-hidden />
              Ghana&#39;s #1 Digital Platform
            </Badge>

            <h1
              id="hero-heading"
              className="text-4xl sm:text-5xl lg:text-[3.5rem] font-extrabold tracking-tight leading-[1.1]"
            >
              Everything Digital.{" "}
              <span className="text-gradient-brand block sm:inline">
                One Trusted Place.
              </span>
            </h1>

            <p className="text-base sm:text-lg text-muted-foreground leading-relaxed max-w-[520px]">
              Buy data bundles, check WAEC/BECE results, earn rewards, and
              manage your digital life — all from one premium platform built
              for Ghana.
            </p>

            <CTAButtonGroup
              align="center"
              stackOnMobile
              className="lg:justify-start w-full sm:w-auto"
            >
              <Button
                asChild
                variant="brand"
                size="xl"
                className="rounded-xl gap-2 w-full sm:w-auto"
              >
                <Link href="/buy">
                  <Wifi className="h-5 w-5" aria-hidden />
                  Buy Data
                </Link>
              </Button>
              <Button
                asChild
                variant="outline-brand"
                size="xl"
                className="rounded-xl gap-2 w-full sm:w-auto"
              >
                <Link href="/buy">
                  Explore Services
                  <ArrowRight className="h-4 w-4" aria-hidden />
                </Link>
              </Button>
            </CTAButtonGroup>

            {/* Trust badges */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-5 pt-1">
              {TRUST_ITEMS.map(({ icon: Icon, label }) => (
                <div
                  key={label}
                  className="flex items-center gap-1.5 text-sm text-muted-foreground"
                >
                  <Icon className="h-3.5 w-3.5 text-brand shrink-0" aria-hidden />
                  {label}
                </div>
              ))}
            </div>
          </div>

          {/* ── Illustration ─────────────────────────────── */}
          <div className="flex items-center justify-center">
            <HeroCard />
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Decorative hero card ──────────────────────────────────────────────────────

function HeroCard() {
  return (
    <div
      className="relative w-full max-w-[380px] mx-auto select-none"
      aria-hidden
    >
      {/* Soft glow behind the card */}
      <div className="absolute inset-0 rounded-3xl bg-brand/15 blur-2xl scale-110" />

      {/* Card surface */}
      <div className="relative card-base rounded-2xl p-5 space-y-4">

        {/* Active bundle row */}
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-wide">
              Active Bundle
            </p>
            <p className="text-sm font-bold text-foreground mt-0.5">
              MTN Express 5GB
            </p>
          </div>
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10 border border-amber-500/20 shrink-0">
            <Wifi className="h-5 w-5 text-amber-400" />
          </div>
        </div>

        {/* Data usage progress */}
        <div>
          <div className="flex justify-between text-xs text-muted-foreground mb-2">
            <span>Data used</span>
            <span className="font-semibold text-foreground">2.3 / 5 GB</span>
          </div>
          <div className="h-2 w-full rounded-full bg-secondary overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-brand to-brand-300"
              style={{ width: "46%" }}
            />
          </div>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-xl bg-secondary p-3.5">
            <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wide">
              Validity
            </p>
            <p className="text-lg font-bold text-foreground mt-1">24 days</p>
          </div>
          <div className="rounded-xl bg-brand/10 border border-brand/20 p-3.5">
            <p className="text-[10px] font-medium text-brand/70 uppercase tracking-wide">
              Earnings
            </p>
            <p className="text-lg font-bold text-brand mt-1">GH₵ 12.50</p>
          </div>
        </div>

        {/* Status bar */}
        <div className="flex items-center gap-2 rounded-xl bg-secondary/60 px-3.5 py-2.5">
          <span className="h-2 w-2 rounded-full bg-brand animate-pulse shrink-0" />
          <span className="text-xs font-medium text-muted-foreground">
            Delivered instantly
          </span>
          <span className="ml-auto text-xs font-semibold text-brand">Active</span>
        </div>
      </div>

      {/* Floating "Instant" pill */}
      <div className="absolute -top-3 -right-3 rounded-full bg-brand px-3 py-1.5 text-xs font-bold text-black shadow-brand">
        ⚡ Instant
      </div>
    </div>
  );
}
