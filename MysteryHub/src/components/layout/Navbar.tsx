"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  ShoppingBag,
  TrendingUp,
  Wallet,
  LayoutDashboard,
  Headphones,
  Menu,
  X,
  Sparkles,
  LogIn,
  UserPlus,
} from "lucide-react";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

// Map icon string names from siteConfig to Lucide components
const iconMap = {
  Home,
  ShoppingBag,
  TrendingUp,
  Wallet,
  LayoutDashboard,
  Headphones,
} as const;

type IconName = keyof typeof iconMap;

function NavIcon({ name }: { name: string }) {
  const Icon = iconMap[name as IconName];
  if (!Icon) return null;
  return <Icon className="h-4 w-4 shrink-0" aria-hidden />;
}

function NavLink({
  href,
  icon,
  label,
  active,
  onClick,
  mobile = false,
}: {
  href: string;
  icon: string;
  label: string;
  active: boolean;
  onClick?: () => void;
  mobile?: boolean;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={cn(
        "group flex items-center gap-2 rounded-lg font-medium transition-all duration-150",
        mobile
          ? "px-3 py-3 text-sm"
          : "px-3 py-2 text-sm",
        active
          ? "bg-brand/10 text-brand"
          : "text-muted-foreground hover:bg-secondary/80 hover:text-foreground"
      )}
    >
      <NavIcon name={icon} />
      {label}
      {active && mobile && (
        <span className="ml-auto h-1.5 w-1.5 rounded-full bg-brand" aria-hidden />
      )}
    </Link>
  );
}

export function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <header className="sticky top-0 z-40 w-full glass-nav">
      <div className="container-padded flex h-16 items-center justify-between gap-4">

        {/* ── Logo ─────────────────────────────────────────── */}
        <Link
          href="/"
          className="flex shrink-0 items-center gap-2.5"
          aria-label="Mystery Hub home"
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-brand/25 bg-brand/10">
            <Sparkles className="h-4 w-4 text-brand" aria-hidden />
          </div>
          <span className="font-bold text-base leading-none tracking-tight">
            <span className="text-gradient-brand">Mystery</span>
            <span className="text-foreground"> Hub</span>
          </span>
        </Link>

        {/* ── Desktop nav ─────────────────────────────────── */}
        <nav
          className="hidden lg:flex items-center gap-0.5"
          aria-label="Main navigation"
        >
          {siteConfig.nav.main.map((item) => (
            <NavLink
              key={item.href}
              href={item.href}
              icon={item.icon}
              label={item.label}
              active={isActive(item.href)}
            />
          ))}
        </nav>

        {/* ── Right CTAs ──────────────────────────────────── */}
        <div className="flex items-center gap-2">
          <Link
            href="/sign-in"
            className="hidden sm:inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground px-2 py-1.5"
          >
            <LogIn className="h-3.5 w-3.5" aria-hidden />
            Sign In
          </Link>
          <Button
            asChild
            variant="brand"
            size="sm"
            className="hidden sm:inline-flex gap-1.5 rounded-lg"
          >
            <Link href="/sign-up">
              <UserPlus className="h-3.5 w-3.5" aria-hidden />
              Get Started
            </Link>
          </Button>

          {/* ── Mobile hamburger ──────────────────────────── */}
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden h-9 w-9 rounded-lg"
                aria-label={open ? "Close navigation menu" : "Open navigation menu"}
              >
                {open ? (
                  <X className="h-5 w-5" />
                ) : (
                  <Menu className="h-5 w-5" />
                )}
              </Button>
            </SheetTrigger>

            {/* ── Mobile menu sheet ──────────────────────── */}
            <SheetContent
              side="right"
              className="flex w-72 flex-col gap-0 p-0 border-l border-border/50 bg-background"
            >
              <SheetTitle className="sr-only">Navigation menu</SheetTitle>

              {/* Sheet header */}
              <div className="flex h-16 items-center justify-between border-b border-border/50 pl-5 pr-12">
                <Link
                  href="/"
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-2.5"
                  aria-label="Mystery Hub home"
                >
                  <div className="flex h-7 w-7 items-center justify-center rounded-lg border border-brand/25 bg-brand/10">
                    <Sparkles className="h-3.5 w-3.5 text-brand" aria-hidden />
                  </div>
                  <span className="font-bold text-sm leading-none tracking-tight">
                    <span className="text-gradient-brand">Mystery</span>
                    <span className="text-foreground"> Hub</span>
                  </span>
                </Link>
              </div>

              {/* Nav links */}
              <nav
                className="flex-1 overflow-y-auto p-3 space-y-0.5"
                aria-label="Mobile navigation"
              >
                {siteConfig.nav.main.map((item) => (
                  <NavLink
                    key={item.href}
                    href={item.href}
                    icon={item.icon}
                    label={item.label}
                    active={isActive(item.href)}
                    onClick={() => setOpen(false)}
                    mobile
                  />
                ))}

                <Separator className="my-3 bg-border/50" />

                {/* Additional quick links */}
                <NavLink
                  href="/marketplace"
                  icon="ShoppingBag"
                  label="Marketplace"
                  active={isActive("/marketplace")}
                  onClick={() => setOpen(false)}
                  mobile
                />
                <NavLink
                  href="/referrals"
                  icon="TrendingUp"
                  label="Referrals"
                  active={isActive("/referrals")}
                  onClick={() => setOpen(false)}
                  mobile
                />
                <NavLink
                  href="/faq"
                  icon="Headphones"
                  label="FAQ"
                  active={isActive("/faq")}
                  onClick={() => setOpen(false)}
                  mobile
                />
              </nav>

              {/* Sheet footer CTAs */}
              <div className="border-t border-border/50 p-4 space-y-2">
                <Button
                  asChild
                  variant="outline"
                  className="w-full gap-2 rounded-lg"
                  onClick={() => setOpen(false)}
                >
                  <Link href="/sign-in">
                    <LogIn className="h-4 w-4" aria-hidden />
                    Sign In
                  </Link>
                </Button>
                <Button
                  asChild
                  variant="brand"
                  className="w-full gap-2 rounded-lg"
                  onClick={() => setOpen(false)}
                >
                  <Link href="/sign-up">
                    <UserPlus className="h-4 w-4" aria-hidden />
                    Get Started Free
                  </Link>
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
