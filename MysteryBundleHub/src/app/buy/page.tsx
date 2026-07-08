import type { Metadata } from "next";
import { PageContainer } from "@/components/layout/PageContainer";
import { PageHeader } from "@/components/layout/PageHeader";
import { BuyFlow } from "@/components/buy/BuyFlow";

// ─── SEO ──────────────────────────────────────────────────────────────────────

export const metadata: Metadata = {
  title: "Buy Data Bundles",
  description:
    "Purchase MTN, AirtelTigo, and Telecel data bundles instantly. Fast delivery, secure transactions, and Shield Protection on every order.",
  keywords: [
    "buy data bundles Ghana",
    "MTN data bundle",
    "AirtelTigo bundle",
    "Telecel bundle",
    "instant data Ghana",
    "Mystery Hub data",
  ],
  openGraph: {
    title: "Buy Data Bundles — Mystery Hub",
    description:
      "MTN, AirtelTigo, and Telecel data bundles delivered in minutes. Ghana's most trusted data platform.",
    type: "website",
  },
};

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function BuyPage() {
  return (
    <PageContainer narrow className="py-8 md:py-10">
      {/* Page heading */}
      <div className="mb-8">
        <PageHeader
          badge="Data Bundles"
          title="Buy Data Bundles"
          description="MTN, AirtelTigo, and Telecel — delivered to any Ghana number in minutes."
        />
      </div>

      {/* Interactive 4-step purchase wizard */}
      <BuyFlow />
    </PageContainer>
  );
}
