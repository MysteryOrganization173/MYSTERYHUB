"use client";

import * as React from "react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { apiClient } from "@/services/api";
import { toast } from "@/components/ui/toast";

interface AdminSupplierSetting {
  supplierKey: string;
  label: string;
  enabled: boolean;
  priority: number;
  configured: boolean;
  updatedAt: string;
}

export default function AdminSuppliersPage() {
  const [suppliers, setSuppliers] = React.useState<AdminSupplierSetting[] | null>(null);
  const [error, setError] = React.useState<string | null>(null);
  const [savingKey, setSavingKey] = React.useState<string | null>(null);

  const load = React.useCallback(() => {
    apiClient.get<AdminSupplierSetting[]>("/admin/suppliers").then(({ data, error }) => {
      setSuppliers(data ?? []);
      setError(error);
    });
  }, []);

  React.useEffect(() => {
    load();
  }, [load]);

  async function updateSupplier(
    supplierKey: string,
    updates: Partial<Pick<AdminSupplierSetting, "enabled" | "priority">>
  ) {
    setSavingKey(supplierKey);
    const { data, error } = await apiClient.patch<AdminSupplierSetting>("/admin/suppliers", {
      supplierKey,
      ...updates,
    });
    setSavingKey(null);

    if (error || !data) {
      toast.error(error ?? "Failed to update supplier");
      return;
    }

    toast.success(`${data.label} updated`);
    load();
  }

  return (
    <div className="space-y-6">
      <PageHeader
        badge="Admin"
        title="Suppliers"
        description="Lowest-priority-number enabled + configured supplier wins for both catalogue reads and fulfillment. Only two suppliers exist for real — SuccessBizHub (live) and Mock/Test. This never stores credentials; those stay in environment variables."
      />

      {error && <p className="text-sm text-destructive">{error}</p>}

      {suppliers && (
        <div className="grid gap-4 sm:grid-cols-2">
          {suppliers.map((supplier) => (
            <Card key={supplier.supplierKey}>
              <CardContent className="p-5 space-y-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-semibold text-foreground">{supplier.label}</p>
                    <p className="mt-1 font-mono text-[11px] text-muted-foreground">
                      {supplier.supplierKey}
                    </p>
                  </div>
                  <Switch
                    checked={supplier.enabled}
                    disabled={savingKey === supplier.supplierKey}
                    onCheckedChange={(checked) =>
                      updateSupplier(supplier.supplierKey, { enabled: checked })
                    }
                  />
                </div>

                <div className="flex items-center gap-2">
                  <Badge variant={supplier.configured ? "brand" : "muted"}>
                    {supplier.configured ? "Configured" : "Not configured"}
                  </Badge>
                  {supplier.supplierKey === "mock" && (
                    <Badge variant="muted">Mock / Test — not a live supplier</Badge>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <label className="text-xs text-muted-foreground" htmlFor={`priority-${supplier.supplierKey}`}>
                    Priority (lower = preferred)
                  </label>
                  <Input
                    id={`priority-${supplier.supplierKey}`}
                    type="number"
                    defaultValue={supplier.priority}
                    className="h-8 w-20"
                    onBlur={(e) => {
                      const next = Number(e.target.value);
                      if (Number.isFinite(next) && next !== supplier.priority) {
                        updateSupplier(supplier.supplierKey, { priority: next });
                      }
                    }}
                  />
                </div>

                {supplier.enabled && !supplier.configured && (
                  <p className="text-[11px] text-amber-500">
                    Enabled but not configured — requests will fall through to the next
                    available supplier rather than fail.
                  </p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
