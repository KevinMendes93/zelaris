import { PaginatedResponse, BasePaginationFilters } from "./pagination.model";
import { TipoPagamento } from "../enums";

export interface Funcao {
  id: number;
  nome: string;
  salario: number;
  tipoPagamento: TipoPagamento;
  anoVigente: number;
  createdBy?: number;
  updatedBy?: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateFuncaoData {
  nome: string;
  salario: number;
  anoVigente: number;
}

export interface UpdateFuncaoData {
  nome?: string;
  salario?: number;
  anoVigente?: number;
}

export type PaginatedFuncoes = PaginatedResponse<Funcao>;

export interface FuncaoFilters extends BasePaginationFilters {
  sortBy?: "nome" | "salario" | "tipoPagamento" | "anoVigente";
  ano?: number;
  tipoPagamento?: TipoPagamento;
}
