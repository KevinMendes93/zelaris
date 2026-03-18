import { apiFetch } from "@/src/lib/api";
import type { ApiResponse } from "@/src/models/api.model";
import type { PaginatedResponse } from "@/src/models/pagination.model";
import type {
  Funcionario,
  CreateFuncionarioDto,
  UpdateFuncionarioDto,
  FuncionarioFilters,
} from "@/src/models/funcionario.model";


export const funcionarioService = {
  async list(
    filters?: FuncionarioFilters,
  ): Promise<ApiResponse<PaginatedResponse<Funcionario>>> {
    const params = new URLSearchParams();

    if (filters?.search) params.append("search", filters.search);
    if (filters?.sortBy) params.append("sortBy", filters.sortBy);
    if (filters?.sortOrder) params.append("sortOrder", filters.sortOrder);
    if (filters?.createdAtFrom)
      params.append("createdAtFrom", filters.createdAtFrom);
    if (filters?.createdAtTo) params.append("createdAtTo", filters.createdAtTo);
    if (filters?.freelancer !== undefined)
      params.append("freelancer", String(filters.freelancer));
    if (filters?.ativo !== undefined)
      params.append("ativo", String(filters.ativo));

    const queryString = params.toString();
    const endpoint = queryString
      ? `/funcionarios?${queryString}`
      : "/funcionarios";

    return apiFetch<PaginatedResponse<Funcionario>>(endpoint, {
      method: "GET",
    });
  },

  async findToAlocacao(
    dataHoraInicio: string,
    dataHoraFim: string,
    isFt: boolean,
    excludeAlocacaoId?: number,
  ): Promise<ApiResponse<Funcionario[]>> {
    const params = new URLSearchParams({
      dataHoraInicio,
      dataHoraFim,
      isFt: String(isFt),
    });
    if (excludeAlocacaoId)
      params.append("excludeAlocacaoId", excludeAlocacaoId.toString());
    return apiFetch<Funcionario[]>(
      `/funcionarios/to-alocacao?${params.toString()}`,
      { method: "GET" },
    );
  },

  async getById(id: number): Promise<ApiResponse<Funcionario>> {
    return apiFetch<Funcionario>(`/funcionarios/${id}`, {
      method: "GET",
    });
  },

  async create(data: CreateFuncionarioDto): Promise<ApiResponse<Funcionario>> {
    return apiFetch<Funcionario>("/funcionarios", {
      method: "POST",
      body: data,
    });
  },

  async update(
    id: number,
    data: UpdateFuncionarioDto,
  ): Promise<ApiResponse<Funcionario>> {
    return apiFetch<Funcionario>(`/funcionarios/${id}`, {
      method: "PUT",
      body: data,
    });
  },

  async delete(id: number): Promise<ApiResponse<null>> {
    return apiFetch<null>(`/funcionarios/${id}`, {
      method: "DELETE",
    });
  },

  async toggleAtivo(id: number): Promise<ApiResponse<Funcionario>> {
    return apiFetch<Funcionario>(`/funcionarios/${id}/toggle-ativo`, {
      method: "PATCH",
    });
  },
};
