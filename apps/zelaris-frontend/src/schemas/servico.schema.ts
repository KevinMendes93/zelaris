import { z } from "zod";
import { StatusServico } from "../enums";

export const servicoSchema = z
  .object({
    descricao: z
      .string()
      .min(1, "Descrição é obrigatória")
      .max(1000, "Descrição não pode ter mais de 1000 caracteres"),

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
      .optional()
      .or(z.literal(""))
      .transform((val) => (val === "" ? undefined : val))
      .nullable(),

    hora_fim: z
      .string()
      .optional()
      .or(z.literal(""))
      .transform((val) => (val === "" ? undefined : val)),

    valor: z.coerce.number().min(0, "Valor não pode ser negativo"),

    status: z.nativeEnum(StatusServico),

    observacao: z
      .string()
      .max(1000, "Observação não pode ter mais de 1000 caracteres")
      .optional()
      .or(z.literal(""))
      .transform((val) => (val === "" ? undefined : val)),

    clienteId: z.coerce
      .number()
      .int("Cliente inválido")
      .positive("Cliente é obrigatório"),
  })
  .superRefine((data, ctx) => {
    if (data.data_fim && !data.hora_fim) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Hora de fim é obrigatória quando data de fim é informada",
        path: ["hora_fim"],
      });
    }
    if (data.hora_fim && !data.data_fim) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Data de fim é obrigatória quando hora de fim é informada",
        path: ["data_fim"],
      });
    }

    if (data.data_fim && data.hora_fim) {
      const inicio = new Date(`${data.data_inicio}T${data.hora_inicio}`);
      const fim = new Date(`${data.data_fim}T${data.hora_fim}`);

      if (fim < inicio) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Data/hora de fim deve ser posterior à data/hora de início",
          path: ["data_fim"],
        });
      }
    }
  });

export type ServicoFormData = z.infer<typeof servicoSchema>;
