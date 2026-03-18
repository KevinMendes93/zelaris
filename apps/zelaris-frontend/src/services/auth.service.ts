import { apiFetch } from "@/src/lib/api";
import type { ApiResponse } from "@/src/models/api.model";
import type {
  LoginData,
  RegisterData,
  LoginResponse,
  RegisterResponse,
} from "@/src/models/auth.model";
import type { User } from "@/src/models/user.model";

export const authService = {

  async login(data: LoginData): Promise<ApiResponse<LoginResponse>> {
    return apiFetch<LoginResponse>("/auth/login", {
      method: "POST",
      body: data,
    });
  },

  async register(data: RegisterData): Promise<ApiResponse<RegisterResponse>> {
    return apiFetch<RegisterResponse>("/auth/register", {
      method: "POST",
      body: data,
    });
  },

  async logout(): Promise<ApiResponse<null>> {
    return apiFetch<null>("/auth/logout", {
      method: "POST",
    });
  },

  async getCurrentUser(): Promise<ApiResponse<User>> {
    return apiFetch<User>("/users/me", {
      method: "GET",
    });
  },

  async refresh(): Promise<ApiResponse<null>> {
    return apiFetch<null>("/auth/refresh", {
      method: "POST",
    });
  },

  async forgotPassword(email: string): Promise<ApiResponse<null>> {
    return apiFetch<null>("/auth/forgot-password", {
      method: "POST",
      body: { email },
    });
  },

  async resetPassword(
    token: string,
    senha: string
  ): Promise<ApiResponse<null>> {
    return apiFetch<null>("/auth/reset-password", {
      method: "POST",
      body: { token, senha },
    });
  },
};
