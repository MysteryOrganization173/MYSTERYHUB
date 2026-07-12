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
    "Mystery Hub is a digital services platform for connectivity, mobile services, marketplace tools, results checking, and more — all in one trusted place.",
  keywords: [
    "digital services Ghana",
    "mobile services",
    "internet packages Ghana",
    "digital connectivity",
    "MTN internet packages",
    "AirtelTigo packages",
    "Telecel packages",
    "WAEC results checker Ghana",
    "BECE results",
    "digital marketplace Ghana",
    "Mystery Hub",
  ],
  openGraph: {
    title: "Mystery Hub — Everything Digital. One Trusted Place.",
    description:
      "Digital services, mobile connectivity, and more — built for Ghana. Fast. Secure. Trusted.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Mystery Hub — Everything Digital. One Trusted Place.",
    description:
      "Digital services, mobile connectivity, and more — built for Ghana.",
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

      {/* 3. Featured internet packages — MTN, AirtelTigo, Telecel */}
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
