import Link from "next/link";
import { Wifi, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Section, SectionHeader } from "@/components/layout";
import { cn } from "@/lib/utils";

// ─── Types ────────────────────────────────────────────────────────────────────

type NetworkColor = "amber" | "red" | "blue";

interface BundleItem {
  id: string;
  network: string;
  plan: string;
  data: string;
  validity: string;
  price: string;
  color: NetworkColor;
  popular?: boolean;
}

// ─── Static data ──────────────────────────────────────────────────────────────

const FEATURED_BUNDLES: BundleItem[] = [
  {
    id:       "mtn-express",
    network:  "MTN",
    plan:     "Express",
    data:     "5GB",
    validity: "30 days",
    price:    "GH₵ 30",
    color:    "amber",
    popular:  true,
  },
  {
    id:       "mtn-budget",
    network:  "MTN",
    plan:     "Budget",
    data:     "2GB",
    validity: "7 days",
    price:    "GH₵ 10",
    color:    "amber",
  },
  {
    id:       "airteltigo",
    network:  "AirtelTigo",
    plan:     "Standard",
    data:     "4GB",
    validity: "30 days",
    price:    "GH₵ 25",
    color:    "red",
  },
  {
    id:       "telecel",
    network:  "Telecel",
    plan:     "Standard",
    data:     "3GB",
    validity: "30 days",
    price:    "GH₵ 20",
    color:    "blue",
  },
];

const networkColors: Record<
  NetworkColor,
  { card: string; icon: string; networkText: string }
> = {
  amber: {
    card:        "border-amber-500/20 hover:border-amber-500/40",
    icon:        "bg-amber-500/10 border-amber-500/20 text-amber-400",
    networkText: "text-amber-400",
  },
  red: {
    card:        "border-red-500/20 hover:border-red-500/40",
    icon:        "bg-red-500/10 border-red-500/20 text-red-400",
    networkText: "text-red-400",
  },
  blue: {
    card:        "border-blue-500/20 hover:border-blue-500/40",
    icon:        "bg-blue-500/10 border-blue-500/20 text-blue-400",
    networkText: "text-blue-400",
  },
};

// ─── Section ──────────────────────────────────────────────────────────────────

export function FeaturedBundlesSection() {
  return (
    <Section size="lg" className="bg-secondary/30">
      <SectionHeader
        badge="Internet Packages"
        title="Popular Packages Across Networks"
        description="Choose from MTN, AirtelTigo, and Telecel plans. Delivered to your number within seconds."
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        {FEATURED_BUNDLES.map((bundle) => {
          const colors = networkColors[bundle.color];
          return (
            <article
              key={bundle.id}
              className={cn(
                "card-base rounded-2xl p-5 flex flex-col gap-4 relative overflow-hidden",
                "transition-all duration-200 hover:-translate-y-0.5 hover:shadow-card-hover",
                colors.card
              )}
            >
              {bundle.popular && (
                <div className="absolute top-3 right-3">
                  <Badge
                    variant="brand"
                    className="text-[10px] font-bold px-2 py-0.5"
                  >
                    Popular
                  </Badge>
                </div>
              )}

              {/* Network identifier */}
              <div className="flex items-center gap-3">
                <div
                  className={cn(
                    "flex h-10 w-10 items-center justify-center rounded-xl border shrink-0",
                    colors.icon
                  )}
                >
                  <Wifi className="h-4 w-4" aria-hidden />
                </div>
                <div>
                  <p
                    className={cn(
                      "text-xs font-bold uppercase tracking-wide",
                      colors.networkText
                    )}
                  >
                    {bundle.network}
                  </p>
                  <p className="text-xs text-muted-foreground">{bundle.plan}</p>
                </div>
              </div>

              {/* Data amount */}
              <div>
                <p className="text-4xl font-extrabold text-foreground leading-none">
                  {bundle.data}
                </p>
                <p className="text-xs text-muted-foreground mt-1.5">
                  {bundle.validity}
                </p>
              </div>

              {/* Price row + CTA */}
              <div className="flex items-center justify-between gap-3 mt-auto pt-3 border-t border-border/50">
                <span className="text-lg font-bold text-foreground">
                  {bundle.price}
                </span>
                <Button
                  asChild
                  variant="brand"
                  size="sm"
                  className="rounded-lg shrink-0"
                >
                  <Link href="/buy">Buy Now</Link>
                </Button>
              </div>
            </article>
          );
        })}
      </div>

      {/* See all CTA */}
      <div className="flex justify-center mt-8">
        <Button
          asChild
          variant="outline-brand"
          className="rounded-xl gap-2"
        >
          <Link href="/buy">
            See All Packages
            <ArrowRight className="h-4 w-4" aria-hidden />
          </Link>
        </Button>
      </div>
    </Section>
  );
}
