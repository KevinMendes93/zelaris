import { StatusServico } from "../enums";
import { Cliente } from "./cliente.model";
import { PaginatedResponse, BasePaginationFilters } from "./pagination.model";

export interface Servico {
  id: number;
  descricao: string;
  data_hora_inicio: string;
  data_hora_fim?: string | null;
  valor: number;
  status: StatusServico;
  observacao?: string;
  cliente: Cliente;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateServicoPayload {
  descricao: string;
  data_hora_inicio: string;
  data_hora_fim?: string | null;
  valor: number;
  status: StatusServico;
  observacao?: string;
  clienteId: number;
}

export interface UpdateServicoPayload {
  descricao?: string;
  data_hora_inicio?: string;
  data_hora_fim?: string | null;
  valor?: number;
  status?: StatusServico;
  observacao?: string;
  clienteId?: number;
}

export type PaginatedServicos = PaginatedResponse<Servico>;

export interface ServicoFilters extends BasePaginationFilters {
  sortBy?:
  | "descricao"
  | "data_hora_inicio"
  | "data_hora_fim"
  | "valor"
  | "clienteNome"
  | "createdAt";
  dataHoraInicio?: string;
  dataHoraFim?: string;
  status?: string;
  clienteId?: number;
}
