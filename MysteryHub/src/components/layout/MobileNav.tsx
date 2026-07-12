"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  ShoppingBag,
  TrendingUp,
  Wallet,
  LayoutDashboard,
} from "lucide-react";
import { cn } from "@/lib/utils";

const mobileNavItems = [
  { label: "Home",      href: "/",          Icon: Home },
  { label: "Buy",       href: "/buy",        Icon: ShoppingBag },
  { label: "Earn",      href: "/earn",       Icon: TrendingUp },
  { label: "Wallet",    href: "/wallet",     Icon: Wallet },
  { label: "Dashboard", href: "/dashboard",  Icon: LayoutDashboard },
] as const;

export function MobileNav() {
  const pathname = usePathname();

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <nav
      aria-label="Mobile bottom navigation"
      className={cn(
        "lg:hidden fixed bottom-0 inset-x-0 z-40",
        "border-t border-border/50 bg-background/95 backdrop-blur-md",
        "safe-bottom"
      )}
    >
      <div className="flex items-stretch justify-around h-16">
        {mobileNavItems.map(({ label, href, Icon }) => {
          const active = isActive(href);
          return (
            <Link
              key={href}
              href={href}
              aria-current={active ? "page" : undefined}
              aria-label={label}
              className={cn(
                "flex flex-1 flex-col items-center justify-center gap-1 py-2 tap-none",
                "transition-colors duration-150 min-w-0",
                active ? "text-brand" : "text-muted-foreground hover:text-foreground"
              )}
            >
              <div className="relative flex items-center justify-center">
                <Icon
                  className={cn(
                    "h-5 w-5 transition-transform duration-150",
                    active && "scale-110"
                  )}
                  aria-hidden
                />
                {active && (
                  <span
                    className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 h-0.5 w-4 rounded-full bg-brand"
                    aria-hidden
                  />
                )}
              </div>
              <span
                className={cn(
                  "text-[10px] font-medium leading-none tracking-tight",
                  active ? "text-brand" : "text-muted-foreground"
                )}
              >
                {label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
