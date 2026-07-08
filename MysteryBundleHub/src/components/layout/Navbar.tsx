"use client";

import Link from "next/link";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/50 bg-background/80 backdrop-blur-md">
      <div className="container-padded flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-bold text-lg">
          <span className="text-gradient-brand">{siteConfig.shortName}</span>
          <span className="text-foreground hidden sm:inline">Mystery Bundle Hub</span>
        </Link>

        <nav className="hidden md:flex items-center gap-6">
          {siteConfig.nav.main.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "text-sm font-medium text-muted-foreground transition-colors",
                "hover:text-foreground"
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <Link
            href="/sign-in"
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            Sign In
          </Link>
          <Link
            href="/sign-up"
            className={cn(
              "inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium",
              "bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
            )}
          >
            Get Started
          </Link>
        </div>
      </div>
    </header>
  );
}
