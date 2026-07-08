import type {
  Bundle,
  BundleFilters,
  PaginatedResponse,
  SortOption,
} from "@/types";
import { apiClient } from "./api";

export interface GetBundlesParams {
  page?: number;
  limit?: number;
  sort?: SortOption;
  filters?: BundleFilters;
}

export const bundlesService = {
  getAll: (params: GetBundlesParams = {}) => {
    const { page = 1, limit = 12, sort = "newest", filters = {} } = params;
    const searchParams = new URLSearchParams({
      page: String(page),
      limit: String(limit),
      sort,
      ...Object.fromEntries(
        Object.entries(filters)
          .filter(([, v]) => v !== undefined)
          .map(([k, v]) => [k, String(v)])
      ),
    });
    return apiClient.get<PaginatedResponse<Bundle>>(`/bundles?${searchParams}`);
  },

  getBySlug: (slug: string) =>
    apiClient.get<Bundle>(`/bundles/${slug}`),

  getFeatured: () =>
    apiClient.get<Bundle[]>("/bundles/featured"),

  getRelated: (bundleId: string, limit = 4) =>
    apiClient.get<Bundle[]>(`/bundles/${bundleId}/related?limit=${limit}`),
};
