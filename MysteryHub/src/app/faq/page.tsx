import type { Metadata } from "next";
import { HelpCircle } from "lucide-react";
import { PageContainer } from "@/components/layout/PageContainer";
import { PageHeader } from "@/components/layout/PageHeader";
import { ComingSoon } from "@/components/shared/ComingSoon";

export const metadata: Metadata = {
  title: "FAQ",
  description: "Frequently asked questions about Mystery Hub — buying, earning, wallet, and more.",
};

export default function FaqPage() {
  return (
    <PageContainer>
      <PageHeader
        badge="Help"
        title="Frequently Asked Questions"
        description="Find answers to the most common questions about Mystery Hub — how it works, how to buy, earn, withdraw, and more."
      />
      <ComingSoon
        icon={<HelpCircle className="h-8 w-8 text-brand" aria-hidden />}
        title="FAQ is being written"
        description="Comprehensive answers to all your questions are being prepared."
      />
    </PageContainer>
  );
}
