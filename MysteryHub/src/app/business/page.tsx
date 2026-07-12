import type { Metadata } from "next";
import { Briefcase } from "lucide-react";
import { PageContainer } from "@/components/layout/PageContainer";
import { PageHeader } from "@/components/layout/PageHeader";
import { ComingSoon } from "@/components/shared/ComingSoon";

export const metadata: Metadata = {
  title: "For Business",
  description: "Mystery Hub for businesses — bulk purchasing, reseller tools, and business accounts.",
};

export default function BusinessPage() {
  return (
    <PageContainer>
      <PageHeader
        badge="Business"
        title="Mystery Hub for Business"
        description="Bulk purchasing, reseller tools, sub-accounts, and business-grade reporting — built for teams and entrepreneurs."
      />
      <ComingSoon
        icon={<Briefcase className="h-8 w-8 text-brand" aria-hidden />}
        title="Business tools are in development"
        description="Enterprise features, reseller accounts, and team management are coming."
      />
    </PageContainer>
  );
}
