import type { Metadata } from "next";
import { TrendingUp } from "lucide-react";
import { PageContainer } from "@/components/layout/PageContainer";
import { PageHeader } from "@/components/layout/PageHeader";
import { ComingSoon } from "@/components/shared/ComingSoon";

export const metadata: Metadata = {
  title: "Earn",
  description: "Complete tasks, refer friends, and earn rewards on Mystery Hub.",
};

export default function EarnPage() {
  return (
    <PageContainer>
      <PageHeader
        badge="Earn"
        title="Earn Rewards"
        description="Complete tasks, refer friends, participate in promotions, and grow your balance — all on one platform."
      />
      <ComingSoon
        icon={<TrendingUp className="h-8 w-8 text-brand" aria-hidden />}
        title="Earn hub is in progress"
        description="Earning opportunities and tasks are being set up. Stay tuned for launch."
      />
    </PageContainer>
  );
}
