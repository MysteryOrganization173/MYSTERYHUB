import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ThemeProvider } from "@/components/shared/ThemeProvider";
import { Toaster } from "sonner";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Mystery Bundle Hub — Discover Curated Mystery Bundles",
    template: "%s | Mystery Bundle Hub",
  },
  description:
    "Discover curated mystery bundles at unbeatable prices. Unlock surprise packages across tech, gaming, fashion, and more.",
  keywords: [
    "mystery bundle",
    "surprise box",
    "mystery box",
    "curated bundles",
    "deals",
    "marketplace",
  ],
  authors: [{ name: "Mystery Bundle Hub" }],
  creator: "Mystery Bundle Hub",
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"
  ),
  openGraph: {
    type: "website",
    locale: "en_US",
    url: process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000",
    title: "Mystery Bundle Hub",
    description:
      "Discover curated mystery bundles at unbeatable prices. Unlock surprise packages.",
    siteName: "Mystery Bundle Hub",
  },
  twitter: {
    card: "summary_large_image",
    title: "Mystery Bundle Hub",
    description: "Discover curated mystery bundles at unbeatable prices.",
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
    { media: "(prefers-color-scheme: dark)", color: "#18C964" },
    { media: "(prefers-color-scheme: light)", color: "#18C964" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
          disableTransitionOnChange
        >
          {children}
          <Toaster
            position="bottom-right"
            theme="dark"
            richColors
            toastOptions={{
              style: {
                background: "hsl(0 0% 7%)",
                border: "1px solid hsl(0 0% 14%)",
                color: "hsl(0 0% 97%)",
              },
            }}
          />
        </ThemeProvider>
      </body>
    </html>
  );
}
