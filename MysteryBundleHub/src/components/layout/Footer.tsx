import Link from "next/link";
import { siteConfig } from "@/config/site";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border/50 bg-background">
      <div className="container-padded py-12 lg:py-16">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4 lg:grid-cols-5">
          {/* Brand column */}
          <div className="col-span-2 md:col-span-4 lg:col-span-1">
            <Link href="/" className="font-bold text-lg text-gradient-brand">
              {siteConfig.shortName}
            </Link>
            <p className="mt-3 text-sm text-muted-foreground max-w-xs">
              {siteConfig.description}
            </p>
          </div>

          {/* Link groups */}
          {siteConfig.nav.footer.map((group) => (
            <div key={group.group}>
              <h3 className="text-sm font-semibold text-foreground mb-3">
                {group.group}
              </h3>
              <ul className="space-y-2">
                {group.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 border-t border-border/50 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground">
            &copy; {year} {siteConfig.name}. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            {Object.entries(siteConfig.links).map(([platform, url]) => (
              <Link
                key={platform}
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-muted-foreground hover:text-foreground transition-colors capitalize"
              >
                {platform}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
