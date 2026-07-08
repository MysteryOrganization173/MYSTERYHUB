import Link from "next/link";
import { Tag, CreditCard, Smartphone, ArrowRight } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Section, SectionHeader } from "@/components/layout";
import { cn } from "@/lib/utils";

// ─── Types ────────────────────────────────────────────────────────────────────

type CategoryColor = "brand" | "blue" | "purple";

interface MarketplaceCategory {
  id: string;
  icon: LucideIcon;
  title: string;
  description: string;
  count: string;
  color: CategoryColor;
  href: string;
}

// ─── Static data ──────────────────────────────────────────────────────────────

const MARKETPLACE_CATEGORIES: MarketplaceCategory[] = [
  {
    id:          "vouchers",
    icon:        Tag,
    title:       "Gift Vouchers",
    description: "Google Play, Apple, Steam, Netflix, Amazon, and many more premium vouchers.",
    count:       "200+ products",
    color:       "brand",
    href:        "/marketplace",
  },
  {
    id:          "airtime",
    icon:        Smartphone,
    title:       "Airtime & Credit",
    description: "Top up any Ghana network instantly — MTN, AirtelTigo, and Telecel.",
    count:       "All networks",
    color:       "blue",
    href:        "/marketplace",
  },
  {
    id:          "payments",
    icon:        CreditCard,
    title:       "Digital Payments",
    description: "Pay bills, subscriptions, and online services effortlessly from your wallet.",
    count:       "50+ services",
    color:       "purple",
    href:        "/marketplace",
  },
];

const catColors: Record<CategoryColor, { icon: string; count: string }> = {
  brand:  { icon: "bg-brand/10 border-brand/20 text-brand",                count: "text-brand"      },
  blue:   { icon: "bg-blue-500/10 border-blue-500/20 text-blue-400",       count: "text-blue-400"   },
  purple: { icon: "bg-purple-500/10 border-purple-500/20 text-purple-400", count: "text-purple-400" },
};

// ─── Section ──────────────────────────────────────────────────────────────────

export function MarketplacePreview() {
  return (
    <Section size="lg" className="bg-secondary/20">
      <SectionHeader
        badge="Marketplace"
        title="Your Digital Store, Always Open"
        description="Browse hundreds of digital products from trusted sellers — available 24/7."
      />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5">
        {MARKETPLACE_CATEGORIES.map((cat) => {
          const colors = catColors[cat.color];
          const Icon = cat.icon;
          return (
            <Link
              key={cat.id}
              href={cat.href}
              className={cn(
                "group card-base rounded-2xl p-6 flex flex-col gap-4",
                "transition-all duration-200 hover:-translate-y-0.5 hover:shadow-card-hover",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                "focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              )}
            >
              <div
                className={cn(
                  "flex h-12 w-12 items-center justify-center rounded-xl border",
                  colors.icon
                )}
              >
                <Icon className="h-6 w-6" aria-hidden />
              </div>

              <div className="space-y-1.5 flex-1">
                <h3 className="font-semibold text-foreground transition-colors duration-150 group-hover:text-brand">
                  {cat.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {cat.description}
                </p>
              </div>

              <div className="flex items-center justify-between">
                <span className={cn("text-xs font-medium", colors.count)}>
                  {cat.count}
                </span>
                <ArrowRight
                  className="h-4 w-4 text-muted-foreground transition-all duration-150 group-hover:text-brand group-hover:translate-x-0.5"
                  aria-hidden
                />
              </div>
            </Link>
          );
        })}
      </div>

      <div className="flex justify-center mt-8">
        <Button asChild variant="brand" size="lg" className="rounded-xl gap-2">
          <Link href="/marketplace">
            Browse Marketplace
            <ArrowRight className="h-4 w-4" aria-hidden />
          </Link>
        </Button>
      </div>
    </Section>
  );
}
