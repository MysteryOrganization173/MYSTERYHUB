import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { AppProviders } from "@/providers";
import { AnnouncementBanner } from "@/components/layout/AnnouncementBanner";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { MobileNav } from "@/components/layout/MobileNav";
import { ReferralCapture } from "@/components/shared/ReferralCapture";
import { LOGO_IMAGES } from "@/config/images";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Mystery Hub — Everything Digital. One Trusted Place.",
    template: "%s | Mystery Hub",
  },
  description:
    "Mystery Hub is a digital services platform for connectivity, mobile services, marketplace tools, and more — all in one trusted place.",
  keywords: [
    "mystery hub",
    "digital services",
    "mobile services",
    "internet packages",
    "digital connectivity",
    "digital marketplace",
    "digital wallet",
    "digital platform",
  ],
  authors: [{ name: "Mystery Hub" }],
  creator: "Mystery Hub",
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"
  ),
  openGraph: {
    type: "website",
    locale: "en_US",
    url: process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000",
    title: "Mystery Hub — Everything Digital. One Trusted Place.",
    description:
      "A digital services platform for connectivity, mobile services, and more.",
    siteName: "Mystery Hub",
    images: [
      {
        url: LOGO_IMAGES.ogImage.src,
        width: LOGO_IMAGES.ogImage.width,
        height: LOGO_IMAGES.ogImage.height,
        alt: LOGO_IMAGES.ogImage.alt,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Mystery Hub — Everything Digital. One Trusted Place.",
    description:
      "A digital services platform for connectivity, mobile services, and more.",
    images: [LOGO_IMAGES.ogImage.src],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: dark)",  color: "#18C964" },
    { media: "(prefers-color-scheme: light)", color: "#18C964" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        <AppProviders>
          <ReferralCapture />
          <div className="flex min-h-screen flex-col">
            {/* Top announcement strip */}
            <AnnouncementBanner />

            {/* Sticky header nav */}
            <Navbar />

            {/* Page content — padded bottom for mobile nav bar */}
            <main className="flex-1 pb-16 lg:pb-0">
              {children}
            </main>

            {/* Site footer */}
            <Footer />

            {/* Fixed bottom nav — mobile only */}
            <MobileNav />
          </div>
        </AppProviders>
      </body>
    </html>
  );
}
