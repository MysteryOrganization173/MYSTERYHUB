"use client";

/**
 * SignInForm — email + password sign-in.
 *
 * Calls `authService.signIn` only — never the Supabase SDK directly.
 * Validates with the existing `signInSchema` (src/utils/validators.ts) via
 * React Hook Form + Zod, matching the rest of the codebase's form
 * conventions.
 */
import * as React from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, LogIn } from "lucide-react";
import { authService } from "@/services/auth";
import { signInSchema, type SignInInput } from "@/utils/validators";
import { ROUTES } from "@/constants";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/toast";

export function SignInForm() {
  const router = useRouter();
  const [showPassword, setShowPassword] = React.useState(false);
  const [formError, setFormError] = React.useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignInInput>({
    resolver: zodResolver(signInSchema),
    defaultValues: { email: "", password: "" },
  });

  async function onSubmit(values: SignInInput) {
    setFormError(null);
    const { data, error } = await authService.signIn(values);

    if (error || !data) {
      setFormError(error ?? "Sign in failed. Please try again.");
      toast.error(error ?? "Sign in failed. Please try again.");
      return;
    }

    toast.success(`Welcome back, ${data.fullName ?? data.email}!`);
    router.push(ROUTES.home);
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
      {/* Email */}
      <div className="field-wrapper">
        <Label htmlFor="signin-email" className="field-label">
          Email address
        </Label>
        <Input
          id="signin-email"
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
          error={Boolean(errors.email)}
          aria-invalid={Boolean(errors.email)}
          {...register("email")}
        />
        {errors.email && (
          <p className="field-error">{errors.email.message}</p>
        )}
      </div>

      {/* Password */}
      <div className="field-wrapper">
        <div className="flex items-center justify-between">
          <Label htmlFor="signin-password" className="field-label">
            Password
          </Label>
          <Link
            href={ROUTES.forgotPassword}
            className="text-xs font-medium text-brand hover:underline"
          >
            Forgot password?
          </Link>
        </div>
        <div className="relative">
          <Input
            id="signin-password"
            type={showPassword ? "text" : "password"}
            autoComplete="current-password"
            placeholder="••••••••"
            error={Boolean(errors.password)}
            aria-invalid={Boolean(errors.password)}
            className="pr-10"
            {...register("password")}
          />
          <button
            type="button"
            onClick={() => setShowPassword((v) => !v)}
            className="absolute inset-y-0 right-0 flex items-center px-3 text-muted-foreground hover:text-foreground"
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? (
              <EyeOff className="h-4 w-4" aria-hidden />
            ) : (
              <Eye className="h-4 w-4" aria-hidden />
            )}
          </button>
        </div>
        {errors.password && (
          <p className="field-error">{errors.password.message}</p>
        )}
      </div>

      {/* Form-level error */}
      {formError && (
        <p
          role="alert"
          className={cn(
            "rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive"
          )}
        >
          {formError}
        </p>
      )}

      <Button
        type="submit"
        variant="brand"
        size="lg"
        className="w-full gap-2"
        loading={isSubmitting}
      >
        <LogIn className="h-4 w-4" aria-hidden />
        Sign In
      </Button>

      <p className="text-center text-sm text-muted-foreground">
        Don&apos;t have an account?{" "}
        <Link
          href={ROUTES.signUp}
          className="font-medium text-brand hover:underline"
        >
          Sign up
        </Link>
      </p>
    </form>
  );
}
