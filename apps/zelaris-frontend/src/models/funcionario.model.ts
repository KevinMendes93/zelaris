import {
  EstadoCivil,
  GrauInstrucao,
  ModoTrabalho,
  TipoSanguineo,
  OrgaoEmissor,
  TipoConta,
  MeioTransporte,
  TipoConducao,
  TipoAnexoFuncionario,
} from "../enums";
import { Endereco } from "./endereco.model";

export interface ContaBancaria {
  id?: number;
  banco: string;
  tipoConta: TipoConta;
  agencia: string;
  agenciaDigito?: string;
  conta: string;
  contaDigito?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface AnexoFuncionario {
  id?: number;
  tipo?: TipoAnexoFuncionario;
  path: string;
  originalName: string;
  mimeType: string;
  size: number;
  uploadedAt?: Date;
}

export interface DocumentacaoFuncionario {
  id?: number;
  ctps?: string;
  serie?: string;
  pis?: string;
  identidade: string;
  orgaoEmissor: OrgaoEmissor;
  dataEmissao: string;
  tituloEleitor?: string;
  zonaEleitoral?: string;
  anexos?: AnexoFuncionario[];
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ValeTransporte {
  id?: number;
  tipoConducao: TipoConducao;
  meioTransporte: MeioTransporte;
  quantidade: number;
  valorUnitario: number;
  valorTotal: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface Funcionario {
  id?: number;
  freelancer: boolean;
  nome: string;
  dataNascimento: string;
  telefone: string;
  recado?: string;
  cpf: string;
  email: string;
  endereco: Endereco;
  documentacao?: DocumentacaoFuncionario;
  grauInstrucao?: GrauInstrucao;
  estadoCivil?: EstadoCivil;
  tipoSanguineo?: TipoSanguineo;
  naturalidade?: string;
  nomePai?: string;
  nomeMae?: string;
  dependentesIR?: number;
  filhosMenores14?: number;
  modoTrabalho?: ModoTrabalho;
  funcaoId?: number;
  funcao?: {
    id: number;
    nome: string;
    salario: number;
  };
  dataFimContratoExperiencia?: string;
  horarioInicio?: string;
  horarioFim?: string;
  dataEncerramento?: string;
  temValeTransporte: boolean;
  valeTransportes?: ValeTransporte[];
  pix?: string;
  contaBancaria?: ContaBancaria;
  ativo?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface CreateFuncionarioDto {
  freelancer: boolean;
  nome: string;
  dataNascimento: string;
  telefone: string;
  recado?: string;
  cpf: string;
  email?: string;
  endereco: Omit<Endereco, "id">;
  documentacao?: Omit<
    DocumentacaoFuncionario,
    "id" | "createdAt" | "updatedAt" | "anexos"
  >;
  grauInstrucao?: GrauInstrucao;
  estadoCivil?: EstadoCivil;
  tipoSanguineo?: TipoSanguineo;
  naturalidade?: string;
  nomePai?: string;
  nomeMae?: string;
  dependentesIR?: number;
  filhosMenores14?: number;
  modoTrabalho?: ModoTrabalho;
  funcaoId: number;
  dataFimContratoExperiencia?: string;
  horarioInicio?: string;
  horarioFim?: string;
  temValeTransporte: boolean;
  valeTransportes?: Omit<ValeTransporte, "id" | "createdAt" | "updatedAt">[];
  pix?: string;
  contaBancaria?: Omit<ContaBancaria, "id" | "createdAt" | "updatedAt">;
}

export type UpdateFuncionarioDto = Partial<CreateFuncionarioDto>;

export interface FuncionarioListItem {
  id: number;
  nome: string;
  cpf: string;
  email?: string;
  telefone: string;
  createdAt: Date;
  freelancer: boolean;
  ativo: boolean;
}

export interface FuncionarioFilters {
  search?: string;
  sortBy?: string;
  sortOrder?: "ASC" | "DESC";
  createdAtFrom?: string;
  createdAtTo?: string;
  freelancer?: boolean;
  ativo?: boolean;
}
