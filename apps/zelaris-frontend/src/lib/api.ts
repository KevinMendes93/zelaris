import type { ApiFetchOptions, ApiResponse } from "@/src/models/api.model";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

async function apiFetch<T = unknown>(
  endpoint: string,
  options: ApiFetchOptions & { _isRetry?: boolean; _skipRefresh?: boolean } = {}
): Promise<ApiResponse<T>> {
  const {
    body,
    _isRetry = false,
    _skipRefresh = false,
    ...restOptions
  } = options;

  const headers: HeadersInit = {
    ...(body && { "Content-Type": "application/json" }),
    ...restOptions.headers,
  };

  const config: RequestInit = {
    ...restOptions,
    credentials: "include",
    headers,
  };

  if (body) {
    config.body = JSON.stringify(body);
  }

  try {
    const response = await fetch(`${API_URL}${endpoint}`, config);
    const status = response.status;

    let raw: unknown;
    try {
      raw = await response.json();
    } catch {
      raw = null;
    }

    if (response.ok) {
      if (
        raw &&
        typeof raw === "object" &&
        "success" in raw &&
        "message" in raw &&
        "timestamp" in raw
      ) {
        return raw as ApiResponse<T>;
      }

      const message =
        (raw as { message?: string })?.message ||
        "Operação realizada com sucesso";
      return {
        success: true,
        message,
        data: raw as T,
        timestamp: new Date().toISOString(),
      };
    }

    if (status === 401 && !_skipRefresh && !_isRetry) {
      const isAuthRoute =
        endpoint.includes("/auth/login") ||
        endpoint.includes("/auth/register") ||
        endpoint.includes("/auth/refresh");

      if (!isAuthRoute) {
        const refreshResponse = await apiFetch<null>("/auth/refresh", {
          method: "POST",
          _skipRefresh: true,
        });

        if (refreshResponse.success) {
          return apiFetch<T>(endpoint, {
            ...options,
            _isRetry: true,
            _skipRefresh: true,
          });
        }
      }
    }

    if (
      raw &&
      typeof raw === "object" &&
      "success" in raw &&
      "message" in raw &&
      "timestamp" in raw
    ) {
      return raw as ApiResponse<T>;
    }

    const message = (raw as { message?: string })?.message || `Erro ${status}`;
    return {
      success: false,
      message,
      data: undefined,
      timestamp: new Date().toISOString(),
    };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "Erro de conexão",
      data: undefined,
      timestamp: new Date().toISOString(),
    };
  }
}

export { apiFetch };
