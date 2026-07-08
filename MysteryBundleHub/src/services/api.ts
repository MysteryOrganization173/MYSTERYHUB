/**
 * Base API client for Mystery Bundle Hub.
 * Wraps fetch with typed responses, error handling, and auth headers.
 * All service modules should use these helpers rather than raw fetch.
 */

import type { ApiResponse } from "@/types";

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

type RequestOptions = Omit<RequestInit, "body"> & {
  body?: unknown;
};

async function request<T>(
  endpoint: string,
  options: RequestOptions = {}
): Promise<ApiResponse<T>> {
  const { body, headers, ...rest } = options;

  try {
    const res = await fetch(`${BASE_URL}/api${endpoint}`, {
      ...rest,
      headers: {
        "Content-Type": "application/json",
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
