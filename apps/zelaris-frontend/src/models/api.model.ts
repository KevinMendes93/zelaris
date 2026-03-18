export interface ApiFetchOptions {
  method?: string;
  headers?: HeadersInit;
  body?: Record<string, unknown> | unknown[] | object;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
  timestamp: string;
}
