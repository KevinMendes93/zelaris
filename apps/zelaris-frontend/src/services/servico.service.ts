import { apiFetch } from "@/src/lib/api";
import type { ApiResponse } from "@/src/models/api.model";
import type {
  Servico,
  CreateServicoPayload,
  UpdateServicoPayload,
  PaginatedServicos,
  ServicoFilters,
} from "@/src/models/servico.model";
import { StatusServico } from "../enums";

export const servicoService = {
  async list(
    filters?: ServicoFilters
  ): Promise<ApiResponse<PaginatedServicos>> {
    const params = new URLSearchParams();

    if (filters?.page) params.append("page", filters.page.toString());
    if (filters?.limit) params.append("limit", filters.limit.toString());
    if (filters?.sortBy) params.append("sortBy", filters.sortBy);
    if (filters?.sortOrder) params.append("sortOrder", filters.sortOrder);
    if (filters?.search) params.append("search", filters.search);
    if (filters?.dataHoraInicio) {
      params.append("dataHoraInicio", filters.dataHoraInicio);
    }
    if (filters?.dataHoraFim) {
      params.append("dataHoraFim", filters.dataHoraFim);
    }
    if (filters?.status) params.append("status", filters.status);
    if (filters?.clienteId)
      params.append("clienteId", filters.clienteId.toString());

    const queryString = params.toString();
    const endpoint = queryString ? `/servico?${queryString}` : "/servico";

    return apiFetch<PaginatedServicos>(endpoint, {
      method: "GET",
    });
  },

  async getById(id: number): Promise<ApiResponse<Servico>> {
    return apiFetch<Servico>(`/servico/${id}`, {
      method: "GET",
    });
  },

  async create(data: CreateServicoPayload): Promise<ApiResponse<Servico>> {
    return apiFetch<Servico>("/servico", {
      method: "POST",
      body: data,
    });
  },

  async update(
    id: number,
    data: UpdateServicoPayload
  ): Promise<ApiResponse<Servico>> {
    return apiFetch<Servico>(`/servico/${id}`, {
      method: "PUT",
      body: data,
    });
  },

  async changeStatus(
    id: number,
    status: StatusServico
  ): Promise<ApiResponse<Servico>> {
    return apiFetch<Servico>(`/servico/${id}/change-status`, {
      method: "PATCH",
      body: { status },
    });
  },

  async remove(id: number): Promise<ApiResponse<null>> {
    return apiFetch<null>(`/servico/${id}`, {
      method: "DELETE",
    });
  },
};
