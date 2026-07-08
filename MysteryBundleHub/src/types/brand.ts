/**
 * Brand System Types — Mystery Hub
 * TypeScript-safe contracts for all brand components and configuration.
 */

// ─── Logo ─────────────────────────────────────────────────────────────────────

export type LogoVariant = "main" | "compact" | "icon" | "loading";

export type LogoSize = "xs" | "sm" | "md" | "lg" | "xl";

export type ColorMode = "light" | "dark" | "auto";

export interface LogoBaseProps {
  className?: string;
  colorMode?: ColorMode;
}

export interface LogoIconProps extends LogoBaseProps {
  size?: LogoSize | number;
  animated?: boolean;
}

export interface LogoMainProps extends LogoBaseProps {
  size?: LogoSize;
  showTagline?: boolean;
}

export interface LogoCompactProps extends LogoBaseProps {
  size?: LogoSize;
}

export interface LogoLoadingProps extends LogoBaseProps {
  size?: LogoSize;
  label?: string;
}

// ─── Brand Components ─────────────────────────────────────────────────────────

export interface BrandLogoProps extends LogoBaseProps {
  variant?: LogoVariant;
  size?: LogoSize;
  showTagline?: boolean;
  /** Wraps the logo in a Next.js Link when provided */
  href?: string;
  onClick?: () => void;
}

export interface BrandIconProps extends LogoBaseProps {
  size?: LogoSize | number;
  animated?: boolean;
  pulse?: boolean;
}

export interface LoadingBrandProps {
  /** Render as a full-screen fixed overlay */
  fullScreen?: boolean;
  /** Render as an absolute overlay inside a relative parent */
  overlay?: boolean;
  message?: string;
  className?: string;
}

// ─── Image Config ─────────────────────────────────────────────────────────────

export interface ImageEntry {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  blurDataURL?: string;
}

export interface ImageDirectoryConfig {
  logos: string;
  hero: string;
  banners: string;
  marketplace: string;
  utilities: string;
  referrals: string;
  checkers: string;
}

// ─── Brand Config ─────────────────────────────────────────────────────────────

export interface BrandColorShades {
  50: string;
  100: string;
  200: string;
  300: string;
  400: string;
  500: string;
  600: string;
  700: string;
  800: string;
  900: string;
}

export interface BrandPalette {
  primary: string;
  shades: BrandColorShades;
}

export interface BrandConfig {
  name: string;
  shortName: string;
  tagline: string;
  description: string;
  palette: BrandPalette;
  images: {
    dirs: ImageDirectoryConfig;
    logo: string;
    logomark: string;
    favicon: string;
    ogImage: string;
  };
}

// ─── Navigation ───────────────────────────────────────────────────────────────

export interface NavItem {
  label: string;
  href: string;
  icon?: string;
  badge?: string;
  isExternal?: boolean;
}

export interface NavGroup {
  group: string;
  links: Omit<NavItem, "icon">[];
}

// ─── Services ─────────────────────────────────────────────────────────────────

export interface ServiceMeta {
  id: string;
  name: string;
  description: string;
  href: string;
  icon: string;
  badge?: string;
  isNew?: boolean;
  isComingSoon?: boolean;
}
