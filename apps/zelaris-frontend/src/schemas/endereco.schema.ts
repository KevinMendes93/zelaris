import { z } from "zod";

export const enderecoSchema = z.object({
  numero: z.string().min(1, "Número é obrigatório").max(10),
  endereco: z.string().min(1, "Endereço é obrigatório").max(100),
  bairro: z.string().min(1, "Bairro é obrigatório").max(50),
  municipio: z.string().min(1, "Município é obrigatório").max(50),
  uf: z.string().length(2, "UF deve ter 2 caracteres").toUpperCase(),
  cep: z
    .string()
    .min(1, "CEP é obrigatório")
    .regex(/^\d{5}-?\d{3}$/, "CEP inválido (use XXXXX-XXX)"),
});

export type EnderecoFormData = z.infer<typeof enderecoSchema>;
