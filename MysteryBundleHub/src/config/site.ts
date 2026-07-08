export const siteConfig = {
  name: "Mystery Bundle Hub",
  shortName: "MBH",
  description:
    "Discover curated mystery bundles at unbeatable prices. Unlock surprise packages across tech, gaming, fashion, and more.",
  url: process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000",
  ogImage: "/images/og-image.png",
  links: {
    twitter: "https://twitter.com/mysterybundlehub",
    instagram: "https://instagram.com/mysterybundlehub",
    discord: "https://discord.gg/mysterybundlehub",
    github: "https://github.com/mysterybundlehub",
  },
  contact: {
    email: "hello@mysterybundlehub.com",
    support: "support@mysterybundlehub.com",
  },
  branding: {
    primaryColor: "#18C964",
    logoPath: "/images/logos/logo.svg",
    logomarkPath: "/images/logos/logomark.svg",
    faviconPath: "/favicon.ico",
  },
  features: {
    referrals: process.env.NEXT_PUBLIC_ENABLE_REFERRALS === "true",
    affiliates: process.env.NEXT_PUBLIC_ENABLE_AFFILIATES === "true",
    maintenanceMode: process.env.NEXT_PUBLIC_MAINTENANCE_MODE === "true",
  },
  nav: {
    main: [
      { label: "Bundles", href: "/bundles" },
      { label: "How It Works", href: "/how-it-works" },
      { label: "Marketplace", href: "/marketplace" },
      { label: "Referrals", href: "/referrals" },
    ],
    footer: [
      {
        group: "Product",
        links: [
          { label: "All Bundles", href: "/bundles" },
          { label: "How It Works", href: "/how-it-works" },
          { label: "Pricing", href: "/pricing" },
          { label: "Marketplace", href: "/marketplace" },
        ],
      },
      {
        group: "Company",
        links: [
          { label: "About Us", href: "/about" },
          { label: "Blog", href: "/blog" },
          { label: "Careers", href: "/careers" },
          { label: "Press", href: "/press" },
        ],
      },
      {
        group: "Support",
        links: [
          { label: "Help Center", href: "/help" },
          { label: "Contact Us", href: "/contact" },
          { label: "Refund Policy", href: "/refunds" },
          { label: "Affiliate Program", href: "/affiliates" },
        ],
      },
      {
        group: "Legal",
        links: [
          { label: "Privacy Policy", href: "/privacy" },
          { label: "Terms of Service", href: "/terms" },
          { label: "Cookie Policy", href: "/cookies" },
        ],
      },
    ],
  },
} as const;

export type SiteConfig = typeof siteConfig;
