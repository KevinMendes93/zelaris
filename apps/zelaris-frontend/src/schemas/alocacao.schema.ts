import { z } from "zod";

export const alocacaoSchema = z
  .object({
    servicoId: z.number("Serviço é obrigatório").min(1, "Serviço é obrigatório"),
    funcionarioId: z.number("Funcionário é obrigatório").min(1, "Funcionário é obrigatório"),
    data_inicio: z
      .string()
      .min(1, "Data de início é obrigatória")
      .regex(/^\d{4}-\d{2}-\d{2}$/, "Data inválida"),
    hora_inicio: z
      .string()
      .min(1, "Hora de início é obrigatória")
      .regex(/^\d{2}:\d{2}$/, "Hora inválida"),
    data_fim: z
      .string()
      .min(1, "Data de fim é obrigatória")
      .regex(/^\d{4}-\d{2}-\d{2}$/, "Data inválida"),
    hora_fim: z
      .string()
      .min(1, "Hora de fim é obrigatória")
      .regex(/^\d{2}:\d{2}$/, "Hora inválida"),
    ft: z.boolean(),
  })
  .refine(
    (data) => {
      const inicio = new Date(`${data.data_inicio}T${data.hora_inicio}`);
      const fim = new Date(`${data.data_fim}T${data.hora_fim}`);
      return fim > inicio;
    },
    {
      message: "A data/hora de fim deve ser posterior ao início",
      path: ["data_fim"],
    },
  );

export type AlocacaoFormData = z.infer<typeof alocacaoSchema>;
