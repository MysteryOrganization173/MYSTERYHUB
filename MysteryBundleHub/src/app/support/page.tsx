import type { Metadata } from "next";
import { Headphones } from "lucide-react";
import { PageContainer } from "@/components/layout/PageContainer";
import { PageHeader } from "@/components/layout/PageHeader";
import { ComingSoon } from "@/components/shared/ComingSoon";

export const metadata: Metadata = {
  title: "Support",
  description: "Get help from the Mystery Hub support team. We're here for you.",
};

export default function SupportPage() {
  return (
    <PageContainer>
      <PageHeader
        badge="Support"
        title="Help & Support"
        description="Our support team is here to help. Browse common questions or reach out directly and we'll get back to you fast."
      />
      <ComingSoon
        icon={<Headphones className="h-8 w-8 text-brand" aria-hidden />}
        title="Support center is coming"
        description="Live chat, tickets, and a full help center are on the way."
      />
    </PageContainer>
  );
}
