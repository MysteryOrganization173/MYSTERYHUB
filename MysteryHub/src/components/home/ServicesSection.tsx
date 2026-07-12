import Link from "next/link";
import {
  Wifi,
  ScanLine,
  Wallet,
  Store,
  Zap,
  ArrowRight,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Section, SectionHeader } from "@/components/layout";
import { cn } from "@/lib/utils";

// ─── Types ────────────────────────────────────────────────────────────────────

type ServiceColor = "brand" | "blue" | "purple" | "orange" | "yellow";

interface HomeService {
  id: string;
  icon: LucideIcon;
  name: string;
  description: string;
  href: string;
  color: ServiceColor;
  isNew?: boolean;
  isComingSoon?: boolean;
}

// ─── Static data ──────────────────────────────────────────────────────────────

const HOME_SERVICES: HomeService[] = [
  {
    id:          "data",
    icon:        Wifi,
    name:        "Internet Packages",
    description: "MTN, AirtelTigo, and Telecel internet packages — express and budget options for digital connectivity.",
    href:        "/buy",
    color:       "brand",
  },
  {
    id:          "checker",
    icon:        ScanLine,
    name:        "Results Checker",
    description: "Check your WAEC, BECE, and other Ghana examination results quickly and securely.",
    href:        "/checker",
    color:       "blue",
    isNew:       true,
  },
  {
    id:          "wallet",
    icon:        Wallet,
    name:        "Wallet",
    description: "Load and manage your balance, track spending, and make fast checkout in one tap.",
    href:        "/wallet",
    color:       "purple",
  },
  {
    id:          "marketplace",
    icon:        Store,
    name:        "Marketplace",
    description: "Explore and buy digital vouchers, gift cards, and premium digital goods from trusted sellers.",
    href:        "/marketplace",
    color:       "orange",
  },
  {
    id:          "utilities",
    icon:        Zap,
    name:        "Utilities",
    description: "Pay electricity bills, buy airtime, and manage household utility payments in one place.",
    href:        "/buy",
    color:       "yellow",
    isComingSoon: true,
  },
];

const colorMap: Record<ServiceColor, { icon: string }> = {
  brand:  { icon: "bg-brand/10 border-brand/20 text-brand"                },
  blue:   { icon: "bg-blue-500/10 border-blue-500/20 text-blue-400"       },
  purple: { icon: "bg-purple-500/10 border-purple-500/20 text-purple-400" },
  orange: { icon: "bg-orange-500/10 border-orange-500/20 text-orange-400" },
  yellow: { icon: "bg-yellow-500/10 border-yellow-500/20 text-yellow-400" },
};

// ─── Section ──────────────────────────────────────────────────────────────────

export function ServicesSection() {
  return (
    <Section size="lg">
      <SectionHeader
        badge="Our Services"
        title="Everything You Need, In One Place"
        description="From internet packages to examination results — digital and mobile services, covered."
      />

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        {HOME_SERVICES.map((service) => {
          const { icon: colorClass } = colorMap[service.color];
          const Icon = service.icon;
          return (
            <Link
              key={service.id}
              href={service.href}
              className={cn(
                "group relative card-base rounded-2xl p-5 flex flex-col gap-3",
                "transition-all duration-200 hover:-translate-y-0.5 hover:shadow-card-hover",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                "focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              )}
            >
              {/* Icon + badge row */}
              <div className="flex items-start justify-between gap-2 min-h-[2.75rem]">
                <div
                  className={cn(
                    "flex h-11 w-11 items-center justify-center rounded-xl border shrink-0",
                    colorClass
                  )}
                >
                  <Icon className="h-5 w-5" aria-hidden />
                </div>

                {service.isNew && (
                  <Badge
                    variant="brand"
                    className="text-[10px] px-1.5 py-0.5 rounded-md font-bold shrink-0"
                  >
                    New
                  </Badge>
                )}
                {service.isComingSoon && (
                  <Badge
                    variant="muted"
                    className="text-[10px] px-1.5 py-0.5 rounded-md shrink-0"
                  >
                    Soon
                  </Badge>
                )}
              </div>

              {/* Text */}
              <div className="flex-1 space-y-1.5">
                <h3 className="text-sm font-semibold text-foreground leading-tight transition-colors duration-150 group-hover:text-brand">
                  {service.name}
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed line-clamp-3">
                  {service.description}
                </p>
              </div>

              {/* Explore link */}
              <div className="flex items-center gap-1 text-xs font-medium text-muted-foreground transition-colors duration-150 group-hover:text-brand">
                Explore
                <ArrowRight
                  className="h-3 w-3 transition-transform duration-150 group-hover:translate-x-0.5"
                  aria-hidden
                />
              </div>
            </Link>
          );
        })}
      </div>
    </Section>
  );
}
