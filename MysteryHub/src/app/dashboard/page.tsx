"use client";

/**
 * Dashboard Overview — replaces the old `ComingSoon` stub with a real,
 * personalized landing page backed by `/api/orders` and `/api/referrals`
 * (wallet balance comes from `useAuth().profile`, already fetched once
 * at the provider level).
 */
import * as React from "react";
import Link from "next/link";
import {
  ShoppingBag,
  Search,
  Wallet,
  Gift,
  ArrowRight,
  Package,
} from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { StatGrid } from "@/components/layout/StatCard";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/providers/AuthProvider";
import { apiClient } from "@/services/api";
import { formatGHS, formatDate, getTimeOfDayGreeting, firstName } from "@/lib/utils";
import { ROUTES } from "@/constants";
import type { OrderRecord } from "@/types/order";
import type { ReferralStats } from "@/types/referral";

const QUICK_ACTIONS = [
  { href: ROUTES.buy, label: "Buy Bundle", icon: ShoppingBag, color: "brand" as const },
  { href: ROUTES.track, label: "Track Order", icon: Search, color: "blue" as const },
  { href: ROUTES.dashboardWallet, label: "Wallet", icon: Wallet, color: "purple" as const },
  { href: ROUTES.dashboardReferrals, label: "Earn Rewards", icon: Gift, color: "orange" as const },
];

const actionColors: Record<string, string> = {
  brand: "bg-brand/10 border-brand/20 text-brand",
  blue: "bg-blue-500/10 border-blue-500/20 text-blue-400",
  purple: "bg-purple-500/10 border-purple-500/20 text-purple-400",
  orange: "bg-orange-500/10 border-orange-500/20 text-orange-400",
};

const PAYMENT_BADGE: Record<OrderRecord["paymentStatus"], "brand" | "muted" | "destructive"> = {
  paid: "brand",
  pending: "muted",
  failed: "destructive",
  refunded: "muted",
};

export default function DashboardPage() {
  const { user, profile } = useAuth();
  const [orders, setOrders] = React.useState<OrderRecord[] | null>(null);
  const [referralStats, setReferralStats] = React.useState<ReferralStats | null>(null);

  React.useEffect(() => {
    apiClient.get<OrderRecord[]>("/orders").then(({ data }) => setOrders(data ?? []));
    apiClient.get<ReferralStats>("/referrals").then(({ data }) => setReferralStats(data ?? null));
  }, []);

  const greeting = getTimeOfDayGreeting();
  const name = firstName(profile?.fullName ?? user?.fullName ?? null);
  const recentOrders = (orders ?? []).slice(0, 5);

  return (
    <div className="space-y-8">
      <PageHeader
        badge="My Account"
        title={`${greeting}${name ? `, ${name}` : ""}`}
        description="Your personal command center — orders, wallet balance, and referral earnings at a glance."
      />

      <StatGrid
        stats={[
          {
            label: "Wallet Balance",
            value: formatGHS(profile?.walletBalance ?? 0),
            icon: <Wallet className="h-4 w-4" />,
          },
          {
            label: "Total Orders",
            value: orders ? String(orders.length) : "—",
            icon: <Package className="h-4 w-4" />,
          },
          {
            label: "People Referred",
            value: referralStats ? String(referralStats.referredCount) : "—",
            icon: <Gift className="h-4 w-4" />,
          },
          {
            label: "Referral Earnings",
            value: formatGHS(referralStats?.totalEarned ?? 0),
            icon: <Gift className="h-4 w-4" />,
          },
        ]}
      />

      {/* Quick Actions */}
      <section className="space-y-3">
        <h2 className="text-sm font-semibold text-foreground">Quick Actions</h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {QUICK_ACTIONS.map((action) => {
            const Icon = action.icon;
            return (
              <Link
                key={action.label}
                href={action.href}
                className="group flex flex-col items-center gap-2.5 rounded-xl border border-border bg-card p-4 text-center transition-all duration-150 hover:-translate-y-0.5 hover:shadow-card-hover"
              >
                <div
                  className={`flex h-11 w-11 items-center justify-center rounded-xl border ${actionColors[action.color]}`}
                >
                  <Icon className="h-5 w-5" aria-hidden />
                </div>
                <span className="text-sm font-medium text-foreground group-hover:text-brand">
                  {action.label}
                </span>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Recent orders */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-foreground">Recent Orders</h2>
          {orders && orders.length > 0 && (
            <Link
              href={ROUTES.dashboardOrders}
              className="flex items-center gap-1 text-xs font-medium text-brand hover:underline"
            >
              View all
              <ArrowRight className="h-3 w-3" aria-hidden />
            </Link>
          )}
        </div>

        {orders && orders.length === 0 && (
          <Card>
            <CardContent className="flex flex-col items-center gap-3 p-8 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-brand/10 text-brand">
                <ShoppingBag className="h-6 w-6" aria-hidden />
              </div>
              <p className="text-sm text-muted-foreground">
                You haven&apos;t placed an order yet. Your first bundle is a couple of taps away.
              </p>
              <Button asChild variant="brand" size="sm" className="rounded-lg">
                <Link href={ROUTES.buy}>Buy your first bundle</Link>
              </Button>
            </CardContent>
          </Card>
        )}

        {recentOrders.length > 0 && (
          <div className="overflow-x-auto rounded-xl border border-border">
            <table className="w-full min-w-[520px] text-sm">
              <tbody className="divide-y divide-border/60">
                {recentOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-muted/20">
                    <td className="px-4 py-3">
                      <p className="font-medium text-foreground">{order.bundleName}</p>
                      <p className="text-xs text-muted-foreground">{order.recipientPhone}</p>
                    </td>
                    <td className="px-4 py-3 font-medium text-foreground">
                      {formatGHS(order.amount)}
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant={PAYMENT_BADGE[order.paymentStatus]}>
                        {order.paymentStatus}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-right text-muted-foreground">
                      {formatDate(order.createdAt, { month: "short", day: "numeric" })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
