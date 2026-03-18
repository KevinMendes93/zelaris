import { PaginatedResponse, BasePaginationFilters } from './pagination.model';

export enum Role {
  USER = 'USER',
  ADMIN = 'ADMIN',
}

export interface User {
  id: number;
  nome: string;
  cpf: string;
  email: string;
  telefone?: string;
  roles: Role[];
}

export interface JwtPayload {
  sub: number;
  cpf: string;
  roles: Role[];
  iat?: number;
  exp?: number;
}

export type PaginatedUsers = PaginatedResponse<User>;

export interface UserFilters extends BasePaginationFilters {
  sortBy?: 'nome' | 'cpf' | 'email' | 'telefone';
}
