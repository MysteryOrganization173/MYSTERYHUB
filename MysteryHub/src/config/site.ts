export const siteConfig = {
  name: "Mystery Hub",
  shortName: "MH",
  tagline: "Everything Digital. One Trusted Place.",
  description:
    "Mystery Hub is a digital services platform for connectivity, mobile services, marketplace tools, and more — all in one trusted place.",
  url: process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000",
  ogImage: "/images/logos/og-image.png",
  links: {
    twitter: "https://twitter.com/mysteryhub",
    instagram: "https://instagram.com/mysteryhub",
    discord: "https://discord.gg/mysteryhub",
    telegram: "https://t.me/mysteryhub",
  },
  contact: {
    email: "hello@mysteryhub.com",
    support: "support@mysteryhub.com",
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
      { label: "Home",      href: "/",          icon: "Home" },
      { label: "Buy",       href: "/buy",        icon: "ShoppingBag" },
      { label: "Earn",      href: "/earn",       icon: "TrendingUp" },
      { label: "Wallet",    href: "/wallet",     icon: "Wallet" },
      { label: "Dashboard", href: "/dashboard",  icon: "LayoutDashboard" },
      { label: "Support",   href: "/support",    icon: "Headphones" },
    ],
    mobile: [
      { label: "Home",      href: "/",          icon: "Home" },
      { label: "Buy",       href: "/buy",        icon: "ShoppingBag" },
      { label: "Earn",      href: "/earn",       icon: "TrendingUp" },
      { label: "Wallet",    href: "/wallet",     icon: "Wallet" },
      { label: "Dashboard", href: "/dashboard",  icon: "LayoutDashboard" },
    ],
    footer: [
      {
        group: "Platform",
        links: [
          { label: "Buy",         href: "/buy" },
          { label: "Earn",        href: "/earn" },
          { label: "Marketplace", href: "/marketplace" },
          { label: "Wallet",      href: "/wallet" },
          { label: "Referrals",   href: "/referrals" },
        ],
      },
      {
        group: "Tools",
        links: [
          { label: "Track Order", href: "/track" },
          { label: "Dashboard",   href: "/dashboard" },
          { label: "For Business",href: "/business" },
          { label: "Agent Hub",   href: "/agent" },
        ],
      },
      {
        group: "Help",
        links: [
          { label: "FAQ",         href: "/faq" },
          { label: "Support",     href: "/support" },
          { label: "Live Chat",   href: "/support#chat" },
        ],
      },
      {
        group: "Legal",
        links: [
          { label: "Privacy Policy",   href: "/privacy" },
          { label: "Terms of Service", href: "/terms" },
          { label: "Cookie Policy",    href: "/cookies" },
        ],
      },
    ],
  },
} as const;

export type SiteConfig = typeof siteConfig;
