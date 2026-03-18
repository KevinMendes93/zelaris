import type { Funcionario } from "./funcionario.model";
import type { Servico } from "./servico.model";
import type {
  PaginatedResponse,
  BasePaginationFilters,
} from "./pagination.model";

export interface Alocacao {
  id: number;
  data_hora_inicio: string;
  data_hora_fim: string;
  ft: boolean;
  horas_alocadas: number;
  horas_ft: number;
  servico: Servico;
  funcionario: Funcionario;
}

export interface CreateAlocacaoPayload {
  servicoId: number;
  funcionarioId: number;
  data_hora_inicio: string;
  data_hora_fim: string;
  ft: boolean;
}

export interface UpdateAlocacaoPayload {
  servicoId?: number;
  funcionarioId?: number;
  data_hora_inicio?: string;
  data_hora_fim?: string;
  ft: boolean;
}

export type PaginatedAlocacoes = PaginatedResponse<Alocacao>;

export interface AlocacaoFilters extends BasePaginationFilters {
  sortBy?:
    | "dataHoraInicio"
    | "dataHoraFim"
    | "funcionarioNome"
    | "clienteNome";
  dataHoraInicio?: string;
  dataHoraFim?: string;
  funcionarioId?: number;
  clienteId?: number;
  ft?: boolean;
}
