import { Endereco } from "./endereco.model";
import { PaginatedResponse, BasePaginationFilters } from "./pagination.model";

export interface Cliente {
  id: number;
  nome: string;
  documento: string;
  email: string;
  telefone: string;
  endereco: Endereco;
  pessoaJuridica: boolean;
  ativo: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateClientePayload {
  nome: string;
  documento: string;
  email: string;
  telefone: string;
  endereco: Endereco;
  pessoaJuridica: boolean;
  ativo: boolean;
}

export interface UpdateClientePayload {
  nome?: string;
  documento?: string;
  email?: string;
  telefone?: string;
  endereco?: Endereco;
  pessoaJuridica?: boolean;
  ativo?: boolean;
}

export type PaginatedClientes = PaginatedResponse<Cliente>;

export interface ClienteFilters extends BasePaginationFilters {
  sortBy?:
    | "nome"
    | "documento"
    | "email"
    | "pessoaJuridica"
    | "ativo"
    | "createdAt";
  createdAtFrom?: string;
  createdAtTo?: string;
  pessoaJuridica?: boolean;
  ativo?: boolean;
}
