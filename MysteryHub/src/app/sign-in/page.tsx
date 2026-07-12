import type { Metadata } from "next";
import { PageContainer } from "@/components/layout/PageContainer";
import { Card, CardContent } from "@/components/ui/card";
import { BrandLogo } from "@/components/brand";
import { SignInForm } from "@/components/forms/SignInForm";

// ─── SEO ──────────────────────────────────────────────────────────────────────

export const metadata: Metadata = {
  title: "Sign In",
  description:
    "Sign in to your Mystery Hub account to track orders and manage your digital services.",
};

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function SignInPage() {
  return (
    <PageContainer narrow className="flex min-h-[calc(100vh-4rem)] items-center py-10 md:py-14">
      <div className="w-full max-w-md mx-auto space-y-8">
        {/* Brand header */}
        <div className="flex flex-col items-center gap-4 text-center">
          <BrandLogo href="/" size="md" />
          <div className="space-y-1.5">
            <h1 className="text-2xl font-bold tracking-tight text-foreground">
              Welcome back
            </h1>
            <p className="text-sm text-muted-foreground">
              Sign in to continue to Mystery Hub.
            </p>
          </div>
        </div>

        {/* Sign-in card */}
        <Card className="border-border/60">
          <CardContent className="p-6 sm:p-8">
            <SignInForm />
          </CardContent>
        </Card>
      </div>
    </PageContainer>
  );
}
