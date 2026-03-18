import { apiFetch } from "@/src/lib/api";
import type { ApiResponse } from "@/src/models/api.model";
import type {
  Funcao,
  CreateFuncaoData,
  UpdateFuncaoData,
  PaginatedFuncoes,
  FuncaoFilters,
} from "@/src/models/funcao.model";

export const funcaoService = {

  async list(filters?: FuncaoFilters): Promise<ApiResponse<PaginatedFuncoes>> {
    const params = new URLSearchParams();

    if (filters?.page) params.append("page", filters.page.toString());
    if (filters?.limit) params.append("limit", filters.limit.toString());
    if (filters?.ano) params.append("ano", filters.ano.toString());
    if (filters?.tipoPagamento)
      params.append("tipoPagamento", filters.tipoPagamento.toString());
    if (filters?.sortBy) params.append("sortBy", filters.sortBy);
    if (filters?.sortOrder) params.append("sortOrder", filters.sortOrder);
    if (filters?.search) params.append("search", filters.search);

    const queryString = params.toString();
    const endpoint = queryString ? `/funcoes?${queryString}` : "/funcoes";

    return apiFetch<PaginatedFuncoes>(endpoint, {
      method: "GET",
    });
  },

  async getById(id: number): Promise<ApiResponse<Funcao>> {
    return apiFetch<Funcao>(`/funcoes/${id}`, {
      method: "GET",
    });
  },

  async create(data: CreateFuncaoData): Promise<ApiResponse<Funcao>> {
    return apiFetch<Funcao>("/funcoes", {
      method: "POST",
      body: data,
    });
  },

  async update(
    id: number,
    data: UpdateFuncaoData
  ): Promise<ApiResponse<Funcao>> {
    return apiFetch<Funcao>(`/funcoes/${id}`, {
      method: "PATCH",
      body: data,
    });
  },

  async delete(id: number): Promise<ApiResponse<null>> {
    return apiFetch<null>(`/funcoes/${id}`, {
      method: "DELETE",
    });
  },
};
