"use client";

/**
 * AppProviders — single composition root for all React context providers.
 *
 * Rule: add every new provider HERE. layout.tsx should only import this file.
 *
 * Current providers (in order, outermost → innermost):
 *   1. ThemeProvider  — next-themes dark/light toggle
 *   2. TooltipProvider — Radix global tooltip config
 *   3. AuthProvider   — Supabase Auth session (added in Phase 1B)
 *
 * Future providers to add here:
 *   - CartProvider (shopping cart state)
 *   - ModalProvider (portal registry)
 *   - QueryClientProvider (React Query)
 */

import * as React from "react";
import { ThemeProvider } from "@/components/shared/ThemeProvider";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/providers/AuthProvider";
import { Toaster } from "sonner";

interface AppProvidersProps {
  children: React.ReactNode;
}

export function AppProviders({ children }: AppProvidersProps) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="dark"
      enableSystem={false}
      disableTransitionOnChange
    >
      <TooltipProvider delayDuration={300}>
        <AuthProvider>{children}</AuthProvider>
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
      </TooltipProvider>
    </ThemeProvider>
  );
}
