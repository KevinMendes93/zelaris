import type { User } from "./user.model";

// Payload de requisições
export interface LoginData {
  cpf: string;
  senha: string;
}

export interface RegisterData {
  nome: string;
  cpf: string;
  email: string;
  senha: string;
  telefone?: string;
}

export interface LoginResponse {
  accessToken: string;
}

export interface RegisterResponse {
  user: User;
  accessToken: string;
}

/** @deprecated Use LoginData */
export type LoginPayload = LoginData;
/** @deprecated Use RegisterData */
export type RegisterPayload = RegisterData;

export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (cpf: LoginData["cpf"], senha: LoginData["senha"]) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => Promise<void>;
  reloadUser: () => Promise<void>;
}
