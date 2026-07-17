/**
 * Base API client for Mystery Hub.
 * Wraps fetch with typed responses, error handling, and auth headers.
 * All service modules should use these helpers rather than raw fetch.
 *
 * Auth header: this app's Supabase session lives in the browser
 * (localStorage), not a cookie — see `src/lib/supabase/client.ts`'s doc
 * comment. So every request attaches the current session's access token
 * as `Authorization: Bearer <token>` when one exists, and every privileged
 * route (wallet, withdrawals, admin/*) verifies it server-side via
 * `src/lib/supabase/serverAuth.ts`. Public routes ignore the header
 * entirely, so this is safe to send unconditionally.
 */

import type { ApiResponse } from "@/types";
import { supabaseBrowserClient } from "@/lib/supabase/client";

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

type RequestOptions = Omit<RequestInit, "body"> & {
  body?: unknown;
};

async function getAuthHeader(): Promise<Record<string, string>> {
  if (!supabaseBrowserClient) return {};
  try {
    const { data } = await supabaseBrowserClient.auth.getSession();
    const token = data.session?.access_token;
    return token ? { Authorization: `Bearer ${token}` } : {};
  } catch {
    return {};
  }
}

async function request<T>(
  endpoint: string,
  options: RequestOptions = {}
): Promise<ApiResponse<T>> {
  const { body, headers, ...rest } = options;

  try {
    const authHeader = await getAuthHeader();
    const res = await fetch(`${BASE_URL}/api${endpoint}`, {
      ...rest,
      headers: {
        "Content-Type": "application/json",
        ...authHeader,
        ...headers,
      },
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });

    const json = await res.json();

    if (!res.ok) {
      return {
        data: null,
        error: json?.error ?? `Request failed with status ${res.status}`,
      };
    }

    return { data: json as T, error: null };
  } catch (err) {
    const message = err instanceof Error ? err.message : "An unexpected error occurred";
    return { data: null, error: message };
  }
}

export const apiClient = {
  get: <T>(endpoint: string, options?: RequestOptions) =>
    request<T>(endpoint, { method: "GET", ...options }),

  post: <T>(endpoint: string, body: unknown, options?: RequestOptions) =>
    request<T>(endpoint, { method: "POST", body, ...options }),

  put: <T>(endpoint: string, body: unknown, options?: RequestOptions) =>
    request<T>(endpoint, { method: "PUT", body, ...options }),

  patch: <T>(endpoint: string, body: unknown, options?: RequestOptions) =>
    request<T>(endpoint, { method: "PATCH", body, ...options }),

  delete: <T>(endpoint: string, options?: RequestOptions) =>
    request<T>(endpoint, { method: "DELETE", ...options }),
};
