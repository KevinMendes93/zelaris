import { apiFetch } from "@/src/lib/api";
import type { ApiResponse } from "@/src/models/api.model";
import type {
  Alocacao,
  CreateAlocacaoPayload,
  UpdateAlocacaoPayload,
  PaginatedAlocacoes,
  AlocacaoFilters,
} from "@/src/models/alocacao.model";

export const alocacaoService = {
  async list(
    filters?: AlocacaoFilters,
  ): Promise<ApiResponse<PaginatedAlocacoes>> {
    const params = new URLSearchParams();

    if (filters?.page) params.append("page", filters.page.toString());
    if (filters?.limit) params.append("limit", filters.limit.toString());
    if (filters?.sortBy) params.append("sortBy", filters.sortBy);
    if (filters?.sortOrder) params.append("sortOrder", filters.sortOrder);
    if (filters?.search) params.append("search", filters.search);
    if (filters?.dataHoraInicio)
      params.append("dataHoraInicio", filters.dataHoraInicio);
    if (filters?.dataHoraFim)
      params.append("dataHoraFim", filters.dataHoraFim);
    if (filters?.funcionarioId)
      params.append("funcionarioId", filters.funcionarioId.toString());
    if (filters?.clienteId)
      params.append("clienteId", filters.clienteId.toString());
    if (filters?.ft !== undefined) params.append("ft", String(filters.ft));

    const queryString = params.toString();
    const endpoint = queryString ? `/alocacao?${queryString}` : "/alocacao";

    return apiFetch<PaginatedAlocacoes>(endpoint, { method: "GET" });
  },

  async getById(id: number): Promise<ApiResponse<Alocacao>> {
    return apiFetch<Alocacao>(`/alocacao/${id}`, { method: "GET" });
  },

  async create(data: CreateAlocacaoPayload): Promise<ApiResponse<Alocacao>> {
    return apiFetch<Alocacao>("/alocacao", { method: "POST", body: data });
  },

  async update(
    id: number,
    data: UpdateAlocacaoPayload,
  ): Promise<ApiResponse<Alocacao>> {
    return apiFetch<Alocacao>(`/alocacao/${id}`, {
      method: "PUT",
      body: data,
    });
  },

  async remove(id: number): Promise<ApiResponse<null>> {
    return apiFetch<null>(`/alocacao/${id}`, { method: "DELETE" });
  },
};
