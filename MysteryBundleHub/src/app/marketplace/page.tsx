import type { Metadata } from "next";
import { Store } from "lucide-react";
import { PageContainer } from "@/components/layout/PageContainer";
import { PageHeader } from "@/components/layout/PageHeader";
import { ComingSoon } from "@/components/shared/ComingSoon";

export const metadata: Metadata = {
  title: "Marketplace",
  description: "Browse the Mystery Hub marketplace — thousands of digital products from verified sellers.",
};

export default function MarketplacePage() {
  return (
    <PageContainer>
      <PageHeader
        badge="Marketplace"
        title="Explore the Marketplace"
        description="Thousands of digital products from verified sellers. Find what you need at the best prices."
      />
      <ComingSoon
        icon={<Store className="h-8 w-8 text-brand" aria-hidden />}
        title="Marketplace is launching soon"
        description="Curated digital products, verified sellers, and secure payments — all coming soon."
      />
    </PageContainer>
  );
}
