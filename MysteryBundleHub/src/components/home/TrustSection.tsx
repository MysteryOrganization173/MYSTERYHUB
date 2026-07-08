import { Zap, ShieldCheck, Gift, MapPin } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Section, SectionHeader } from "@/components/layout";
import { cn } from "@/lib/utils";

// ─── Types ────────────────────────────────────────────────────────────────────

type PillarColor = "brand" | "blue" | "purple" | "orange";

interface TrustPillar {
  icon: LucideIcon;
  title: string;
  description: string;
  color: PillarColor;
}

// ─── Static data ──────────────────────────────────────────────────────────────

const TRUST_PILLARS: TrustPillar[] = [
  {
    icon:        Zap,
    title:       "Fast Delivery",
    description: "Most data bundles and digital products are delivered within seconds of payment — 24/7, no delays, no queues.",
    color:       "brand",
  },
  {
    icon:        ShieldCheck,
    title:       "Secure Payments",
    description: "Transactions are protected with bank-grade encryption. We accept MoMo, bank transfer, and wallet balance.",
    color:       "blue",
  },
  {
    icon:        Gift,
    title:       "Earn Rewards",
    description: "Every purchase earns you points. Refer friends and earn a commission on every order they place, forever.",
    color:       "purple",
  },
  {
    icon:        MapPin,
    title:       "Ghana Focused",
    description: "Built specifically for Ghana — all major networks, local payment methods, and national examination boards.",
    color:       "orange",
  },
];

const pillarColors: Record<PillarColor, { icon: string; number: string }> = {
  brand:  { icon: "bg-brand/10 border-brand/20 text-brand",                 number: "text-brand"        },
  blue:   { icon: "bg-blue-500/10 border-blue-500/20 text-blue-400",        number: "text-blue-400"     },
  purple: { icon: "bg-purple-500/10 border-purple-500/20 text-purple-400",  number: "text-purple-400"   },
  orange: { icon: "bg-orange-500/10 border-orange-500/20 text-orange-400",  number: "text-orange-400"   },
};

// ─── Section ──────────────────────────────────────────────────────────────────

export function TrustSection() {
  return (
    <Section size="lg">
      <SectionHeader
        badge="Why Mystery Hub"
        title="Built for Trust. Designed for Speed."
        description="We obsess over reliability so you can focus on what matters — getting things done fast."
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
        {TRUST_PILLARS.map((pillar, index) => {
          const colors = pillarColors[pillar.color];
          const Icon = pillar.icon;
          return (
            <div
              key={pillar.title}
              className="card-base rounded-2xl p-6 flex flex-col gap-4 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-card-hover"
            >
              {/* Step number */}
              <span className={cn("text-xs font-bold tabular-nums", colors.number)}>
                0{index + 1}
              </span>

              {/* Icon */}
              <div
                className={cn(
                  "flex h-12 w-12 items-center justify-center rounded-xl border",
                  colors.icon
                )}
              >
                <Icon className="h-6 w-6" aria-hidden />
              </div>

              {/* Copy */}
              <div className="space-y-2">
                <h3 className="text-base font-semibold text-foreground">
                  {pillar.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {pillar.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </Section>
  );
}
