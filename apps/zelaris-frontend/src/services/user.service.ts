import { apiFetch } from "@/src/lib/api";
import type { ApiResponse } from "@/src/models/api.model";
import type {
  User,
  PaginatedUsers,
  UserFilters,
} from "@/src/models/user.model";

export const userService = {
  async list(filters?: UserFilters): Promise<ApiResponse<PaginatedUsers>> {
    const params = new URLSearchParams();

    if (filters?.page) params.append("page", filters.page.toString());
    if (filters?.limit) params.append("limit", filters.limit.toString());
    if (filters?.sortBy) params.append("sortBy", filters.sortBy);
    if (filters?.sortOrder) params.append("sortOrder", filters.sortOrder);
    if (filters?.search) params.append("search", filters.search);

    const queryString = params.toString();
    const endpoint = queryString ? `/users?${queryString}` : "/users";

    return apiFetch<PaginatedUsers>(endpoint, {
      method: "GET",
    });
  },

  async getById(id: number): Promise<ApiResponse<User>> {
    return apiFetch<User>(`/users/${id}`, {
      method: "GET",
    });
  },
};
