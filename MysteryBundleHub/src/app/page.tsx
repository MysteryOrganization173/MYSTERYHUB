import type { Metadata } from "next";
import { HeroSection }            from "@/components/home/HeroSection";
import { ServicesSection }        from "@/components/home/ServicesSection";
import { FeaturedBundlesSection } from "@/components/home/FeaturedBundlesSection";
import { TrustSection }           from "@/components/home/TrustSection";
import { CheckerBanner }          from "@/components/home/CheckerBanner";
import { ReferralSection }        from "@/components/home/ReferralSection";
import { MarketplacePreview }     from "@/components/home/MarketplacePreview";
import { FAQPreview }             from "@/components/home/FAQPreview";

// ─── SEO Metadata ─────────────────────────────────────────────────────────────

export const metadata: Metadata = {
  title: "Mystery Hub — Everything Digital. One Trusted Place.",
  description:
    "Buy data bundles, check WAEC/BECE results, earn rewards, and manage your digital life in one premium Ghanaian platform. Instant delivery. Secure payments. Real rewards.",
  keywords: [
    "data bundles Ghana",
    "MTN bundles",
    "AirtelTigo bundles",
    "Telecel bundles",
    "WAEC results checker Ghana",
    "BECE results",
    "digital marketplace Ghana",
    "earn rewards Ghana",
    "Mystery Hub",
    "buy data online Ghana",
  ],
  openGraph: {
    title: "Mystery Hub — Everything Digital. One Trusted Place.",
    description:
      "Ghana's #1 platform for data bundles, exam results, digital products, and earnings. Fast. Secure. Trusted.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Mystery Hub — Everything Digital. One Trusted Place.",
    description:
      "Ghana's #1 platform for data bundles, exam results, digital products, and earnings.",
  },
};

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function HomePage() {
  return (
    <>
      {/* 1. Hero — headline, CTAs, trust badges, illustration */}
      <HeroSection />

      {/* 2. Services overview — Data, Checker, Wallet, Marketplace, Utilities */}
      <ServicesSection />

      {/* 3. Featured bundles — MTN, AirtelTigo, Telecel */}
      <FeaturedBundlesSection />

      {/* 4. Trust pillars — Fast, Secure, Rewards, Ghana-focused */}
      <TrustSection />

      {/* 5. Results checker CTA strip */}
      <CheckerBanner />

      {/* 6. Referral program CTA */}
      <ReferralSection />

      {/* 7. Marketplace teaser */}
      <MarketplacePreview />

      {/* 8. FAQ preview with accordion */}
      <FAQPreview />
    </>
  );
}
