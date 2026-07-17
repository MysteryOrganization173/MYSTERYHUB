"use client";

/**
 * /dashboard/settings — real, scoped account editing.
 *
 * `full_name` is the only self-editable profile column today (see
 * `profilesService.updateFullName`'s doc comment). Everything else is
 * honestly labeled "coming later" rather than faked with a form that
 * doesn't actually persist.
 */
import * as React from "react";
import { useForm } from "react-hook-form";
import { User, Mail, LogOut } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { apiClient } from "@/services/api";
import { toast } from "@/components/ui/toast";
import { useAuth } from "@/providers/AuthProvider";
import type { Profile } from "@/types/profile";

interface SettingsForm {
  fullName: string;
}

export default function DashboardSettingsPage() {
  const { user, profile, refreshProfile, signOut } = useAuth();

  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting, isDirty },
  } = useForm<SettingsForm>({ defaultValues: { fullName: "" } });

  React.useEffect(() => {
    if (profile) reset({ fullName: profile.fullName ?? "" });
  }, [profile, reset]);

  async function onSubmit(values: SettingsForm) {
    const { data, error } = await apiClient.patch<Profile>("/profile", {
      fullName: values.fullName,
    });
    if (error || !data) {
      toast.error(error ?? "Failed to update profile");
      return;
    }
    toast.success("Profile updated");
    await refreshProfile();
  }

  return (
    <div className="space-y-8">
      <PageHeader
        badge="My Account"
        title="Settings"
        description="Manage your account details. More personalization options are on the way."
      />

      <Card>
        <CardContent className="space-y-5 p-6">
          <div className="flex items-center gap-2">
            <User className="h-4 w-4 text-brand" aria-hidden />
            <h2 className="text-sm font-semibold text-foreground">Profile</h2>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
            <div className="field-wrapper">
              <Label htmlFor="settings-name" className="field-label">
                Full name
              </Label>
              <Input id="settings-name" type="text" placeholder="Kwame Mensah" {...register("fullName")} />
            </div>

            <div className="field-wrapper">
              <Label htmlFor="settings-email" className="field-label">
                Email address
              </Label>
              <div className="relative">
                <Input id="settings-email" type="email" value={user?.email ?? ""} disabled className="pr-9" />
                <Mail className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden />
              </div>
              <p className="field-hint">Email changes aren&apos;t supported yet.</p>
            </div>

            <Button type="submit" variant="brand" loading={isSubmitting} disabled={!isDirty}>
              Save changes
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="flex items-center justify-between gap-4 p-6">
          <div>
            <h2 className="text-sm font-semibold text-foreground">Sign out</h2>
            <p className="text-xs text-muted-foreground">
              End your session on this device.
            </p>
          </div>
          <Button variant="outline" className="gap-2" onClick={() => signOut()}>
            <LogOut className="h-4 w-4" aria-hidden />
            Sign Out
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
