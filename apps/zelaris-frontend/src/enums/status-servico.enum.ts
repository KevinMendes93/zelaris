export enum StatusServico {
  AGENDADO = "AGENDADO",
  EM_ANDAMENTO = "EM_ANDAMENTO",
  FINALIZADO = "FINALIZADO",
  CANCELADO = "CANCELADO",
}

export const StatusServicoLabels: Record<StatusServico, string> = {
  [StatusServico.AGENDADO]: "Agendado",
  [StatusServico.EM_ANDAMENTO]: "Em Andamento",
  [StatusServico.FINALIZADO]: "Finalizado",
  [StatusServico.CANCELADO]: "Cancelado",
};
