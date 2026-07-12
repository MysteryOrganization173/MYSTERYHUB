import type { Metadata } from "next";
import { Users } from "lucide-react";
import { PageContainer } from "@/components/layout/PageContainer";
import { PageHeader } from "@/components/layout/PageHeader";
import { ComingSoon } from "@/components/shared/ComingSoon";

export const metadata: Metadata = {
  title: "Referrals",
  description: "Refer friends to Mystery Hub and earn rewards for every successful referral.",
};

export default function ReferralsPage() {
  return (
    <PageContainer>
      <PageHeader
        badge="Referral Program"
        title="Refer & Earn"
        description="Invite your friends to Mystery Hub and earn a commission every time they make a purchase. No limits, no caps."
      />
      <ComingSoon
        icon={<Users className="h-8 w-8 text-brand" aria-hidden />}
        title="Referral system is coming"
        description="Shareable links, tracking dashboard, and automatic payouts are being built now."
      />
    </PageContainer>
  );
}
