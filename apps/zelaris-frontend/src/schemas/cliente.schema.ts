import { z } from "zod";
import { enderecoSchema } from "./endereco.schema";

const documentoSchema = z
  .string()
  .min(1, "Documento é obrigatório")
  .transform((val) => val.replace(/\D/g, ""))
  .refine(
    (val) => val.length === 11 || val.length === 14,
    "Documento deve ter 11 dígitos (CPF) ou 14 dígitos (CNPJ)",
  );

export const clienteSchema = z.object({
  nome: z
    .string()
    .min(1, "Nome é obrigatório")
    .max(100, "Nome não pode ter mais de 100 caracteres"),

  documento: documentoSchema,

  email: z.email("E-mail inválido").min(1, "E-mail é obrigatório"),

  telefone: z
    .string()
    .min(1, "Telefone é obrigatório")
    .transform((val) => val.replace(/\D/g, ""))
    .refine(
      (val) => val.length >= 10 && val.length <= 11,
      "Telefone deve ter 10 ou 11 dígitos",
    ),

  endereco: enderecoSchema,

  pessoaJuridica: z.boolean(),

  ativo: z.boolean(),
});

export type ClienteFormData = z.infer<typeof clienteSchema>;
