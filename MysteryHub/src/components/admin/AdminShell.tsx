"use client";

/**
 * AdminShell — sidebar + top bar wrapper for every `/admin/**` page.
 *
 * Purely presentational — access control lives in `AdminGuard`
 * (`src/app/admin/layout.tsx` wraps this in it) and, independently and
 * more importantly, in every `/api/admin/*` route itself. See
 * docs/authentication.md.
 */
import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  Users,
  Server,
  Banknote,
  Gift,
  Settings,
  ExternalLink,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { ROUTES } from "@/constants";

const NAV_ITEMS = [
  { href: ROUTES.admin, label: "Overview", icon: LayoutDashboard },
  { href: ROUTES.adminOrders, label: "Orders", icon: Package },
  { href: ROUTES.adminUsers, label: "Users", icon: Users },
  { href: ROUTES.adminSuppliers, label: "Suppliers", icon: Server },
  { href: ROUTES.adminWithdrawals, label: "Withdrawals", icon: Banknote },
  { href: ROUTES.adminReferrals, label: "Referrals", icon: Gift },
  { href: ROUTES.adminSettings, label: "Settings", icon: Settings },
] as const;

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="container-padded py-6 lg:py-8">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[220px_1fr]">
        {/* ── Sidebar ── */}
        <aside className="lg:sticky lg:top-20 lg:self-start">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-brand">
                Admin Console
              </p>
              <p className="text-[11px] text-muted-foreground">Mystery Hub</p>
            </div>
          </div>

          <nav className="flex gap-1.5 overflow-x-auto pb-2 lg:flex-col lg:overflow-visible lg:pb-0">
            {NAV_ITEMS.map((item) => {
              const active =
                item.href === ROUTES.admin
                  ? pathname === ROUTES.admin
                  : pathname.startsWith(item.href);
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex shrink-0 items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                    active
                      ? "bg-brand/10 text-brand"
                      : "text-muted-foreground hover:bg-secondary/70 hover:text-foreground"
                  )}
                >
                  <Icon className="h-4 w-4 shrink-0" aria-hidden />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <Link
            href={ROUTES.home}
            className="mt-4 hidden items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground lg:flex"
          >
            <ExternalLink className="h-3 w-3" aria-hidden />
            Back to site
          </Link>
        </aside>

        {/* ── Content ── */}
        <div className="min-w-0">{children}</div>
      </div>
    </div>
  );
}
