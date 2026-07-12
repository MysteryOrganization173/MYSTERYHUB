import type { Metadata } from "next";
import { PageContainer } from "@/components/layout/PageContainer";
import { PageHeader } from "@/components/layout/PageHeader";
import { BuyFlow } from "@/components/buy/BuyFlow";

// ─── SEO ──────────────────────────────────────────────────────────────────────

export const metadata: Metadata = {
  title: "Internet Packages",
  description:
    "Purchase MTN, AirtelTigo, and Telecel internet packages instantly. Fast delivery, secure transactions, and Shield Protection on every order.",
  keywords: [
    "internet packages Ghana",
    "mobile services Ghana",
    "digital connectivity",
    "MTN internet package",
    "AirtelTigo package",
    "Telecel package",
    "Mystery Hub",
  ],
  openGraph: {
    title: "Internet Packages — Mystery Hub",
    description:
      "MTN, AirtelTigo, and Telecel internet packages delivered in minutes — one of many digital services on Mystery Hub.",
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
          badge="Mobile Services"
          title="Internet Packages"
          description="MTN, AirtelTigo, and Telecel — digital connectivity delivered to any Ghana number in minutes."
        />
      </div>

      {/* Interactive 4-step purchase wizard */}
      <BuyFlow />
    </PageContainer>
  );
}
