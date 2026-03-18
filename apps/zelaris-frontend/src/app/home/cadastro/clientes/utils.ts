import type { ClienteFormData } from "@/src/schemas/cliente.schema";

export function buildClientePayload(data: ClienteFormData) {
  return {
    ...data,
    documento: data.documento.replace(/\D/g, ""),
    telefone: data.telefone.replace(/\D/g, ""),
  };
}
