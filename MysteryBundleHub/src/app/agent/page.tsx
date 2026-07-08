import type { Metadata } from "next";
import { Bot } from "lucide-react";
import { PageContainer } from "@/components/layout/PageContainer";
import { PageHeader } from "@/components/layout/PageHeader";
import { ComingSoon } from "@/components/shared/ComingSoon";

export const metadata: Metadata = {
  title: "Agent Hub",
  description: "Become a Mystery Hub agent — earn commissions, manage clients, and grow your business.",
};

export default function AgentPage() {
  return (
    <PageContainer>
      <PageHeader
        badge="Agent Program"
        title="Agent Hub"
        description="Join the Mystery Hub agent program to earn commissions, bring on clients, and build your digital business."
      />
      <ComingSoon
        icon={<Bot className="h-8 w-8 text-brand" aria-hidden />}
        title="Agent program is being built"
        description="Commission structures, referral tracking, and agent dashboards are coming soon."
      />
    </PageContainer>
  );
}
