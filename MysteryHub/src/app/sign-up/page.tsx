import type { Metadata } from "next";
import { PageContainer } from "@/components/layout/PageContainer";
import { Card, CardContent } from "@/components/ui/card";
import { BrandLogo } from "@/components/brand";
import { SignUpForm } from "@/components/forms/SignUpForm";

// ─── SEO ──────────────────────────────────────────────────────────────────────

export const metadata: Metadata = {
  title: "Sign Up",
  description:
    "Create a free Mystery Hub account to buy internet packages, track orders, and access every digital service in one trusted place.",
};

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function SignUpPage() {
  return (
    <PageContainer narrow className="flex min-h-[calc(100vh-4rem)] items-center py-10 md:py-14">
      <div className="w-full max-w-md mx-auto space-y-8">
        {/* Brand header */}
        <div className="flex flex-col items-center gap-4 text-center">
          <BrandLogo href="/" size="md" />
          <div className="space-y-1.5">
            <h1 className="text-2xl font-bold tracking-tight text-foreground">
              Create your account
            </h1>
            <p className="text-sm text-muted-foreground">
              Join Mystery Hub — everything digital, one trusted place.
            </p>
          </div>
        </div>

        {/* Sign-up card */}
        <Card className="border-border/60">
          <CardContent className="p-6 sm:p-8">
            <SignUpForm />
          </CardContent>
        </Card>
      </div>
    </PageContainer>
  );
}
