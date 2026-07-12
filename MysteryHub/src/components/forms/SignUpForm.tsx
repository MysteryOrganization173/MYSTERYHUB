"use client";

/**
 * SignUpForm — name + email + password registration.
 *
 * Calls `authService.signUp` only — never the Supabase SDK directly.
 * Validates with the existing `signUpSchema` (src/utils/validators.ts) via
 * React Hook Form + Zod. `confirmPassword` is a UI-only field checked by
 * the Zod schema's `.refine()`; it is dropped before calling the service
 * (see `src/types/auth.ts` — `SignUpCredentials` has no `confirmPassword`).
 */
import * as React from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, UserPlus } from "lucide-react";
import { authService } from "@/services/auth";
import { signUpSchema, type SignUpInput } from "@/utils/validators";
import { ROUTES } from "@/constants";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/toast";

export function SignUpForm() {
  const router = useRouter();
  const [showPassword, setShowPassword] = React.useState(false);
  const [formError, setFormError] = React.useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignUpInput>({
    resolver: zodResolver(signUpSchema),
    defaultValues: { name: "", email: "", password: "", confirmPassword: "" },
  });

  async function onSubmit(values: SignUpInput) {
    setFormError(null);
    const { data, error } = await authService.signUp({
      name: values.name,
      email: values.email,
      password: values.password,
    });

    if (error || !data) {
      setFormError(error ?? "Sign up failed. Please try again.");
      toast.error(error ?? "Sign up failed. Please try again.");
      return;
    }

    toast.success("Account created! Redirecting you now…");
    router.push(ROUTES.home);
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
      {/* Name */}
      <div className="field-wrapper">
        <Label htmlFor="signup-name" className="field-label">
          Full name
        </Label>
        <Input
          id="signup-name"
          type="text"
          autoComplete="name"
          placeholder="Kwame Mensah"
          error={Boolean(errors.name)}
          aria-invalid={Boolean(errors.name)}
          {...register("name")}
        />
        {errors.name && <p className="field-error">{errors.name.message}</p>}
      </div>

      {/* Email */}
      <div className="field-wrapper">
        <Label htmlFor="signup-email" className="field-label">
          Email address
        </Label>
        <Input
          id="signup-email"
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
        <Label htmlFor="signup-password" className="field-label">
          Password
        </Label>
        <div className="relative">
          <Input
            id="signup-password"
            type={showPassword ? "text" : "password"}
            autoComplete="new-password"
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
        {errors.password ? (
          <p className="field-error">{errors.password.message}</p>
        ) : (
          <p className="field-hint">
            At least 8 characters, one uppercase letter, and one number.
          </p>
        )}
      </div>

      {/* Confirm password */}
      <div className="field-wrapper">
        <Label htmlFor="signup-confirm-password" className="field-label">
          Confirm password
        </Label>
        <Input
          id="signup-confirm-password"
          type={showPassword ? "text" : "password"}
          autoComplete="new-password"
          placeholder="••••••••"
          error={Boolean(errors.confirmPassword)}
          aria-invalid={Boolean(errors.confirmPassword)}
          {...register("confirmPassword")}
        />
        {errors.confirmPassword && (
          <p className="field-error">{errors.confirmPassword.message}</p>
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
        <UserPlus className="h-4 w-4" aria-hidden />
        Create Account
      </Button>

      <p className="text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link
          href={ROUTES.signIn}
          className="font-medium text-brand hover:underline"
        >
          Sign in
        </Link>
      </p>
    </form>
  );
}
