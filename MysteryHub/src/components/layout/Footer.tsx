import Link from "next/link";
import {
  Twitter,
  Instagram,
  MessageCircle,
  Send,
  Sparkles,
  Mail,
} from "lucide-react";
import { siteConfig } from "@/config/site";

const socialIcons = {
  twitter:   Twitter,
  instagram: Instagram,
  discord:   MessageCircle,
  telegram:  Send,
} as const;

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border/50 bg-background">
      <div className="container-padded py-12 lg:py-16">

        {/* ── Main grid ───────────────────────────────────── */}
        <div className="grid grid-cols-2 gap-8 md:grid-cols-3 lg:grid-cols-5">

          {/* Brand column */}
          <div className="col-span-2 md:col-span-3 lg:col-span-1">
            <Link
              href="/"
              className="inline-flex items-center gap-2.5 mb-4"
              aria-label="Mystery Hub home"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-brand/25 bg-brand/10">
                <Sparkles className="h-4 w-4 text-brand" aria-hidden />
              </div>
              <span className="font-bold text-base leading-none tracking-tight">
                <span className="text-gradient-brand">Mystery</span>
                <span className="text-foreground"> Hub</span>
              </span>
            </Link>

            <p className="text-sm text-muted-foreground leading-relaxed max-w-xs">
              {siteConfig.tagline}
              <br />
              <span className="text-xs mt-1 block">{siteConfig.description.slice(0, 80)}...</span>
            </p>

            {/* Social links */}
            <div className="mt-5 flex items-center gap-3">
              {(Object.entries(siteConfig.links) as [keyof typeof socialIcons, string][]).map(
                ([platform, url]) => {
                  const Icon = socialIcons[platform];
                  if (!Icon) return null;
                  return (
                    <Link
                      key={platform}
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`${siteConfig.name} on ${platform}`}
                      className="flex h-8 w-8 items-center justify-center rounded-lg border border-border/50 text-muted-foreground transition-colors hover:border-brand/30 hover:text-brand"
                    >
                      <Icon className="h-3.5 w-3.5" />
                    </Link>
                  );
                }
              )}
            </div>
          </div>

          {/* Link groups */}
          {siteConfig.nav.footer.map((group) => (
            <div key={group.group}>
              <h3 className="mb-3 text-sm font-semibold text-foreground">
                {group.group}
              </h3>
              <ul className="space-y-2.5">
                {group.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* ── Bottom bar ──────────────────────────────────── */}
        <div className="mt-12 border-t border-border/50 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground">
            &copy; {year}{" "}
            <span className="font-medium text-foreground/70">{siteConfig.name}</span>
            . All rights reserved.
          </p>

          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Mail className="h-3 w-3" aria-hidden />
            <a
              href={`mailto:${siteConfig.contact.support}`}
              className="hover:text-foreground transition-colors"
            >
              {siteConfig.contact.support}
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
