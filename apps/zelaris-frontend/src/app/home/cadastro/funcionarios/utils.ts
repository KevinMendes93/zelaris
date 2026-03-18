import type { FuncionarioFormData } from "@/src/schemas/funcionario.schema";
import { dateToIso } from "@/src/lib/formatters";
import type { PendingAnexo } from "./components/AnexoUpload";

export function buildFuncionarioPayload(
  data: FuncionarioFormData,
  temContaBancaria: boolean,
  isEdit = false,
) {
  return {
    ...data,
    ...(isEdit && { id: undefined }),
    cpf: data.cpf.replace(/\D/g, ""),
    telefone: data.telefone.replace(/\D/g, ""),
    recado: data.recado?.replace(/\D/g, ""),
    dataNascimento: dateToIso(data.dataNascimento),
    tipoSanguineo: data.tipoSanguineo || null,
    documentacao: data.documentacao
      ? {
          ...data.documentacao,
          ...(isEdit && {
            tituloEleitor: data.documentacao.tituloEleitor || null,
          }),
          dataEmissao: dateToIso(data.documentacao.dataEmissao),
        }
      : undefined,
    dataFimContratoExperiencia: data.dataFimContratoExperiencia
      ? dateToIso(data.dataFimContratoExperiencia)
      : undefined,
    dataEncerramento: data.dataEncerramento
      ? dateToIso(data.dataEncerramento)
      : undefined,
    contaBancaria: temContaBancaria ? data.contaBancaria : null,
    horarioInicio: data.horarioInicio ? data.horarioInicio : null,
    horarioFim: data.horarioFim ? data.horarioFim : null,
    valeTransportes: data.temValeTransporte
      ? (data.valeTransportes ?? [])
      : [],
  };
}

export async function uploadAnexos(
  funcionarioId: number,
  pendingAnexos: PendingAnexo[],
) {
  if (pendingAnexos.length === 0) return;

  const { anexoFuncionarioService } = await import(
    "@/src/services/anexo-funcionario.service"
  );

  for (const anexo of pendingAnexos) {
    try {
      await anexoFuncionarioService.upload(
        funcionarioId,
        anexo.file,
        anexo.tipo,
      );
    } catch (error) {
      console.error("Erro ao fazer upload de anexo:", error);
    }
  }
}

export async function deleteAnexos(
  funcionarioId: number,
  anexoIds: number[],
) {
  if (anexoIds.length === 0) return;

  const { anexoFuncionarioService } = await import(
    "@/src/services/anexo-funcionario.service"
  );

  for (const anexoId of anexoIds) {
    try {
      await anexoFuncionarioService.delete(funcionarioId, anexoId);
    } catch (error) {
      console.error("Erro ao deletar anexo:", error);
    }
  }
}
