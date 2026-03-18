import type { ServicoFormData } from "@/src/schemas/servico.schema";
import { currencyToNumber } from "@/src/lib/formatters";

export function buildServicoPayload(data: ServicoFormData) {
  const dataHoraInicio = new Date(
    `${data.data_inicio}T${data.hora_inicio}:00`
  ).toISOString();

  let dataHoraFim: string | null = null;
  if (data.data_fim && data.hora_fim) {
    dataHoraFim = new Date(
      `${data.data_fim}T${data.hora_fim}:00`
    ).toISOString();
  }

  return {
    descricao: data.descricao,
    data_hora_inicio: dataHoraInicio,
    data_hora_fim: dataHoraFim,
    valor:
      typeof data.valor === "string"
        ? currencyToNumber(data.valor)
        : data.valor,
    status: data.status,
    observacao: data.observacao,
    clienteId: data.clienteId,
  };
}
