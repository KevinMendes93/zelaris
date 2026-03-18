import { z } from "zod";
import {
  EstadoCivil,
  GrauInstrucao,
  ModoTrabalho,
  TipoSanguineo,
  OrgaoEmissor,
  TipoConta,
  MeioTransporte,
  TipoConducao,
} from "../enums";
import { enderecoSchema } from "./endereco.schema";

export const documentacaoSchema = z.object({
  identidade: z
    .string("Identidade é obrigatória")
    .min(1, "Identidade é obrigatória")
    .max(20),
  orgaoEmissor: z.enum(Object.values(OrgaoEmissor) as [string, ...string[]], {
    message: "Órgão emissor inválido",
  }),
  ctps: z.string().max(50).optional().nullable(),
  serie: z.string().max(20).optional().nullable(),
  pis: z.string().max(20).optional().nullable(),
  dataEmissao: z
    .string("Data de emissão é obrigatória")
    .min(1, "Data de emissão é obrigatória"),
  tituloEleitor: z.string().max(20).optional().nullable(),
  zonaEleitoral: z.string().max(10).optional().nullable(),
});

export const contaBancariaSchema = z.object({
  id: z.coerce.number().optional(),
  banco: z
    .string("Nome do banco é obrigatório")
    .min(1, "Nome do banco é obrigatório")
    .max(100),
  agencia: z
    .string("Agência é obrigatória")
    .min(1, "Agência é obrigatória")
    .max(10),
  agenciaDigito: z.string().max(2).nullable().optional(),
  conta: z.string("Conta é obrigatória").min(1, "Conta é obrigatória").max(20),
  contaDigito: z.string().max(2).nullable().optional(),
  tipoConta: z
    .enum(Object.values(TipoConta) as [string, ...string[]], {
      message: "Tipo de conta inválido",
    }),
});

export const valeTransporteSchema = z.object({
  id: z.coerce.number().optional(),
  tipoConducao: z.enum(Object.values(TipoConducao) as [string, ...string[]], {
    message: "Tipo de condução inválido",
  }),
  meioTransporte: z.enum(
    Object.values(MeioTransporte) as [string, ...string[]],
    {
      message: "Meio de transporte inválido",
    }
  ),
  quantidade: z.coerce
    .number({ message: "Quantidade deve ser maior que zero" })
    .min(1, "Quantidade deve ser maior que zero"),
  valorUnitario: z.coerce
    .number({ message: "Valor unitário deve ser maior que zero" })
    .min(0.01, "Valor unitário deve ser maior que zero"),
  valorTotal: z.coerce
    .number({ message: "Valor total deve ser maior que zero" })
    .min(0.01, "Valor total deve ser maior que zero"),
});

export const funcionarioSchema = z
  .object({
    freelancer: z.boolean(),
    nome: z.string("Nome é obrigatório").min(1, "Nome é obrigatório").max(100),
    dataNascimento: z
      .string("Data de nascimento é obrigatória")
      .min(1, "Data de nascimento é obrigatória"),
    telefone: z
      .string("Telefone deve ter 10 ou 11 dígitos")
      .min(10, "Telefone deve ter 10 ou 11 dígitos")
      .max(15, "Telefone inválido"),
    recado: z.string().optional(),
    cpf: z
      .string("CPF deve ter 11 dígitos")
      .min(11, "CPF deve ter 11 dígitos")
      .max(14, "CPF inválido"),
    email: z.email("Email inválido"),
    endereco: enderecoSchema,
    documentacao: documentacaoSchema,
    grauInstrucao: z
      .enum(Object.values(GrauInstrucao) as [string, ...string[]], {
        message: "Grau de instrução inválido",
      })
      .optional()
      .nullable(),
    estadoCivil: z
      .enum(Object.values(EstadoCivil) as [string, ...string[]], {
        message: "Estado civil inválido",
      })
      .optional()
      .nullable(),
    tipoSanguineo: z
      .enum(Object.values(TipoSanguineo) as [string, ...string[]])
      .optional()
      .nullable()
      .or(z.literal("")),
    naturalidade: z.string().max(30).optional().nullable(),
    nomePai: z.string().max(100).optional().nullable(),
    nomeMae: z.string().max(100).optional().nullable(),
    dependentesIR: z.number().int().min(0).optional().nullable().default(0),
    filhosMenores14: z.number().int().min(0).optional().nullable().default(0),
    modoTrabalho: z
      .enum(Object.values(ModoTrabalho) as [string, ...string[]], {
        message: "Modo de trabalho inválido",
      })
      .optional()
      .nullable(),
    funcaoId: z.number("Função é obrigatória").min(1, "Função é obrigatória"),
    dataFimContratoExperiencia: z.string().optional().nullable(),
    horarioInicio: z.string().optional().nullable(),
    horarioFim: z.string().optional().nullable(),
    dataEncerramento: z.string().optional(),
    temValeTransporte: z.boolean(),
    valeTransportes: z.array(valeTransporteSchema).optional(),
    pix: z.string().max(255).optional(),
    contaBancaria: contaBancariaSchema.nullable().optional(),
  })
  .superRefine((data, ctx) => {
    if (!data.freelancer) {
      if (!data.recado || data.recado.trim() === "") {
        ctx.addIssue({
          code: "custom",
          message: "Telefone de recado é obrigatório para não-freelancers",
          path: ["recado"],
        });
      }

      if (!data.email || data.email.trim() === "") {
        ctx.addIssue({
          code: "custom",
          message: "Email é obrigatório para não-freelancers",
          path: ["email"],
        });
      }

      if (!data.grauInstrucao) {
        ctx.addIssue({
          code: "custom",
          message: "Grau de instrução é obrigatório para não-freelancers",
          path: ["grauInstrucao"],
        });
      }

      if (!data.estadoCivil) {
        ctx.addIssue({
          code: "custom",
          message: "Estado civil é obrigatório para não-freelancers",
          path: ["estadoCivil"],
        });
      }

      if (!data.naturalidade || data.naturalidade.trim() === "") {
        ctx.addIssue({
          code: "custom",
          message: "Naturalidade é obrigatória para não-freelancers",
          path: ["naturalidade"],
        });
      }

      if (!data.nomeMae || data.nomeMae.trim() === "") {
        ctx.addIssue({
          code: "custom",
          message: "Nome da mãe é obrigatório para não-freelancers",
          path: ["nomeMae"],
        });
      }

      if (data.dependentesIR === undefined || data.dependentesIR === null) {
        ctx.addIssue({
          code: "custom",
          message: "Dependentes IR é obrigatório para não-freelancers",
          path: ["dependentesIR"],
        });
      }

      if (data.filhosMenores14 === undefined || data.filhosMenores14 === null) {
        ctx.addIssue({
          code: "custom",
          message:
            "Filhos menores de 14 anos é obrigatório para não-freelancers",
          path: ["filhosMenores14"],
        });
      }

      if (!data.modoTrabalho || data.modoTrabalho.trim() === "") {
        ctx.addIssue({
          code: "custom",
          message: "Modo de trabalho é obrigatório para não-freelancers",
          path: ["modoTrabalho"],
        });
      }

      if (
        !data.dataFimContratoExperiencia ||
        data.dataFimContratoExperiencia.trim() === ""
      ) {
        ctx.addIssue({
          code: "custom",
          message:
            "Data fim do contrato de experiência é obrigatória para não-freelancers",
          path: ["dataFimContratoExperiencia"],
        });
      }

      if (!data.documentacao?.ctps || data.documentacao.ctps.trim() === "") {
        ctx.addIssue({
          code: "custom",
          message: "CTPS é obrigatória para não-freelancers",
          path: ["documentacao", "ctps"],
        });
      }

      if (!data.documentacao?.serie || data.documentacao.serie.trim() === "") {
        ctx.addIssue({
          code: "custom",
          message: "Série é obrigatória para não-freelancers",
          path: ["documentacao", "serie"],
        });
      }

      if (!data.documentacao?.pis || data.documentacao.pis.trim() === "") {
        ctx.addIssue({
          code: "custom",
          message: "PIS é obrigatório para não-freelancers",
          path: ["documentacao", "pis"],
        });
      }
    }
    
    if (data.temValeTransporte) {
      if (!data.valeTransportes || data.valeTransportes.length === 0) {
        ctx.addIssue({
          code: "custom",
          message: "Adicione ao menos um vale transporte",
          path: ["valeTransportes"],
        });
      }
    }
  });

export type FuncionarioFormData = z.infer<typeof funcionarioSchema>;
export type DocumentacaoFormData = z.infer<typeof documentacaoSchema>;
export type ContaBancariaFormData = z.infer<typeof contaBancariaSchema>;
export type ValeTransporteFormData = z.infer<typeof valeTransporteSchema>;
