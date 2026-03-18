import { apiFetch } from "@/src/lib/api";
import type { ApiResponse } from "@/src/models/api.model";
import type {
  Cliente,
  CreateClientePayload,
  UpdateClientePayload,
  PaginatedClientes,
  ClienteFilters,
} from "@/src/models/cliente.model";

export const clienteService = {
  async list(
    filters?: ClienteFilters,
  ): Promise<ApiResponse<PaginatedClientes>> {
    const params = new URLSearchParams();

    if (filters?.page) params.append("page", filters.page.toString());
    if (filters?.limit) params.append("limit", filters.limit.toString());
    if (filters?.sortBy) params.append("sortBy", filters.sortBy);
    if (filters?.sortOrder) params.append("sortOrder", filters.sortOrder);
    if (filters?.search) params.append("search", filters.search);
    if (filters?.createdAtFrom)
      params.append("createdAtFrom", filters.createdAtFrom);
    if (filters?.createdAtTo) params.append("createdAtTo", filters.createdAtTo);
    if (filters?.pessoaJuridica !== undefined) {
      params.append("pessoaJuridica", filters.pessoaJuridica.toString());
    }
    if (filters?.ativo !== undefined) {
      params.append("ativo", filters.ativo.toString());
    }

    const queryString = params.toString();
    const endpoint = queryString ? `/clientes?${queryString}` : "/clientes";

    return apiFetch<PaginatedClientes>(endpoint, {
      method: "GET",
    });
  },

  async getById(id: number): Promise<ApiResponse<Cliente>> {
    return apiFetch<Cliente>(`/clientes/${id}`, {
      method: "GET",
    });
  },

  async create(data: CreateClientePayload): Promise<ApiResponse<Cliente>> {
    return apiFetch<Cliente>("/clientes", {
      method: "POST",
      body: data,
    });
  },

  async update(
    id: number,
    data: UpdateClientePayload,
  ): Promise<ApiResponse<Cliente>> {
    return apiFetch<Cliente>(`/clientes/${id}`, {
      method: "PUT",
      body: data,
    });
  },

  async remove(id: number): Promise<ApiResponse<null>> {
    return apiFetch<null>(`/clientes/${id}`, {
      method: "DELETE",
    });
  },

  async toggleAtivo(id: number): Promise<ApiResponse<Cliente>> {
    return apiFetch<Cliente>(`/clientes/${id}/toggle-ativo`, {
      method: "PATCH",
    });
  },
};
