import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { AppProviders } from "@/providers";
import { AnnouncementBanner } from "@/components/layout/AnnouncementBanner";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { MobileNav } from "@/components/layout/MobileNav";
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
    "Mystery Hub is your one trusted platform for digital products, earning opportunities, and seamless transactions. Buy, earn, and grow — all in one place.",
  keywords: [
    "mystery hub",
    "digital marketplace",
    "earn online",
    "digital wallet",
    "buy digital products",
    "online earning",
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
      "Your one trusted platform for digital products, earning opportunities, and seamless transactions.",
    siteName: "Mystery Hub",
  },
  twitter: {
    card: "summary_large_image",
    title: "Mystery Hub — Everything Digital. One Trusted Place.",
    description:
      "Your one trusted platform for digital products, earning opportunities, and seamless transactions.",
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
