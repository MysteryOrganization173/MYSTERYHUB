import type { Metadata } from "next";
import { LayoutDashboard } from "lucide-react";
import { PageContainer } from "@/components/layout/PageContainer";
import { PageHeader } from "@/components/layout/PageHeader";
import { ComingSoon } from "@/components/shared/ComingSoon";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Your personal Mystery Hub dashboard — orders, wallet, referrals, and account overview.",
};

export default function DashboardPage() {
  return (
    <PageContainer>
      <PageHeader
        badge="My Account"
        title="Dashboard"
        description="Your personal command center — view orders, wallet balance, referrals, and account activity at a glance."
      />
      <ComingSoon
        icon={<LayoutDashboard className="h-8 w-8 text-brand" aria-hidden />}
        title="Dashboard is being built"
        description="Your personalized dashboard with orders, wallet, and analytics is on the way."
      />
    </PageContainer>
  );
}
