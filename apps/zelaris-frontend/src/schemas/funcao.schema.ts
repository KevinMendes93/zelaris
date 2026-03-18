import { z } from "zod";
import { TipoPagamento } from "../enums";

export const funcaoSchema = z.object({
  nome: z
    .string()
    .min(1, "Nome da função é obrigatório")
    .max(100, "Nome não pode ter mais de 100 caracteres"),
  salario: z.number().min(0, "Salário deve ser maior ou igual a zero"),
  tipoPagamento: z.enum(Object.values(TipoPagamento)),
  anoVigente: z
    .number()
    .min(1900, "Ano vigente deve ser maior ou igual a 1900")
    .max(2100, "Ano vigente inválido"),
});
export type FuncaoFormData = z.infer<typeof funcaoSchema>;
