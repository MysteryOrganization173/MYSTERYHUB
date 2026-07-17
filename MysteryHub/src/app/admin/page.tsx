"use client";

import * as React from "react";
import Link from "next/link";
import {
  ShoppingBag,
  CheckCircle2,
  XCircle,
  Users,
  Banknote,
  ArrowRight,
} from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { StatGrid } from "@/components/layout/StatCard";
import { Button } from "@/components/ui/button";
import { apiClient } from "@/services/api";
import { formatGHS } from "@/lib/utils";
import { ROUTES } from "@/constants";

interface AdminStats {
  totalOrders: number;
  paidOrders: number;
  deliveredOrders: number;
  failedFulfillments: number;
  totalRevenue: number;
  totalUsers: number;
  pendingWithdrawalCount: number;
  pendingWithdrawalAmount: number;
}

export default function AdminOverviewPage() {
  const [stats, setStats] = React.useState<AdminStats | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    apiClient.get<AdminStats>("/admin/stats").then(({ data, error }) => {
      setStats(data ?? null);
      setError(error);
      setIsLoading(false);
    });
  }, []);

  return (
    <div className="space-y-8">
      <PageHeader
        badge="Admin"
        title="Overview"
        description="Live snapshot of orders, revenue, users, and pending payouts."
      />

      {isLoading && (
        <p className="text-sm text-muted-foreground">Loading stats…</p>
      )}

      {error && !isLoading && (
        <p className="text-sm text-destructive">{error}</p>
      )}

      {stats && !isLoading && (
        <>
          <StatGrid
            stats={[
              {
                label: "Total Orders",
                value: String(stats.totalOrders),
                icon: <ShoppingBag className="h-4 w-4" />,
              },
              {
                label: "Total Revenue (paid)",
                value: formatGHS(stats.totalRevenue),
                icon: <Banknote className="h-4 w-4" />,
              },
              {
                label: "Delivered",
                value: String(stats.deliveredOrders),
                icon: <CheckCircle2 className="h-4 w-4" />,
              },
              {
                label: "Failed Fulfillments",
                value: String(stats.failedFulfillments),
                icon: <XCircle className="h-4 w-4" />,
              },
            ]}
          />

          <StatGrid
            stats={[
              {
                label: "Registered Users",
                value: String(stats.totalUsers),
                icon: <Users className="h-4 w-4" />,
              },
              {
                label: "Pending Withdrawals",
                value: String(stats.pendingWithdrawalCount),
                icon: <Banknote className="h-4 w-4" />,
              },
              {
                label: "Pending Withdrawal Amount",
                value: formatGHS(stats.pendingWithdrawalAmount),
                icon: <Banknote className="h-4 w-4" />,
              },
              {
                label: "Paid Orders",
                value: String(stats.paidOrders),
                icon: <CheckCircle2 className="h-4 w-4" />,
              },
            ]}
          />

          <div className="flex flex-wrap gap-3">
            <Button asChild variant="outline-brand" className="gap-1.5 rounded-lg">
              <Link href={ROUTES.adminWithdrawals}>
                Review withdrawals
                <ArrowRight className="h-3.5 w-3.5" aria-hidden />
              </Link>
            </Button>
            <Button asChild variant="outline" className="gap-1.5 rounded-lg">
              <Link href={ROUTES.adminOrders}>
                View orders
                <ArrowRight className="h-3.5 w-3.5" aria-hidden />
              </Link>
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
