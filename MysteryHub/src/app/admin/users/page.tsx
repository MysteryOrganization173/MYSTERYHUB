"use client";

import * as React from "react";
import { PageHeader } from "@/components/layout/PageHeader";
import { apiClient } from "@/services/api";
import { formatGHS, formatDate } from "@/lib/utils";
import type { Profile } from "@/types/profile";

export default function AdminUsersPage() {
  const [users, setUsers] = React.useState<Profile[] | null>(null);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    apiClient.get<Profile[]>("/admin/users").then(({ data, error }) => {
      setUsers(data ?? []);
      setError(error);
    });
  }, []);

  return (
    <div className="space-y-6">
      <PageHeader
        badge="Admin"
        title="Users"
        description={
          users ? `${users.length} registered user${users.length === 1 ? "" : "s"}.` : "Loading…"
        }
      />

      {error && <p className="text-sm text-destructive">{error}</p>}

      {users && users.length > 0 && (
        <div className="overflow-x-auto rounded-xl border border-border">
          <table className="w-full min-w-[720px] text-sm">
            <thead className="border-b border-border bg-muted/30 text-left text-xs text-muted-foreground">
              <tr>
                <th className="px-4 py-3 font-medium">Name</th>
                <th className="px-4 py-3 font-medium">Email</th>
                <th className="px-4 py-3 font-medium">Referral Code</th>
                <th className="px-4 py-3 font-medium">Wallet Balance</th>
                <th className="px-4 py-3 font-medium">Joined</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-muted/20">
                  <td className="px-4 py-3 text-foreground">{user.fullName ?? "—"}</td>
                  <td className="px-4 py-3 text-muted-foreground">{user.email}</td>
                  <td className="px-4 py-3 font-mono text-xs text-brand">{user.referralCode ?? "—"}</td>
                  <td className="px-4 py-3 font-medium text-foreground">{formatGHS(user.walletBalance)}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-muted-foreground">
                    {formatDate(user.createdAt, { month: "short", day: "numeric", year: "numeric" })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
