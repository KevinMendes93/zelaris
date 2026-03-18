"use client";

import { funcionarioService } from "@/src/services/funcionario.service";
import { funcaoService } from "@/src/services/funcao.service";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  funcionarioSchema,
  type FuncionarioFormData,
} from "@/src/schemas/funcionario.schema";
import { useRouter, useParams } from "next/navigation";
import { useState, useEffect } from "react";
import { useToast } from "@/src/app/components/ui/ToastProvider";
import { useAuth } from "@/src/app/auth/hooks/useAuth";
import { Role } from "@/src/models/user.model";
import { TipoAnexoFuncionario } from "@/src/enums";
import { maskCpf, maskTelefone, isoToDate } from "@/src/lib/formatters";
import { FormPageShell } from "@/src/app/components/layout/FormPageShell";
import { FuncionarioForm } from "../components/FuncionarioForm";
import { useFormSubmit } from "@/src/hooks/useFormSubmit";
import { buildFuncionarioPayload, uploadAnexos, deleteAnexos } from "../utils";
import {
  type PendingAnexo,
  type ExistingAnexo,
} from "../components/AnexoUpload";
import type { Funcao } from "@/src/models/funcao.model";
import type { UpdateFuncionarioDto } from "@/src/models/funcionario.model";

const BACK_PATH = "/home/cadastro/funcionarios";

export default function EditarFuncionarioPage() {
  const router = useRouter();
  const params = useParams();
  const { showToast } = useToast();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [funcoes, setFuncoes] = useState<Funcao[]>([]);
  const [temContaBancaria, setTemContaBancaria] = useState(false);
  const [pendingAnexos, setPendingAnexos] = useState<PendingAnexo[]>([]);
  const [existingAnexos, setExistingAnexos] = useState<ExistingAnexo[]>([]);
  const [anexosToDelete, setAnexosToDelete] = useState<number[]>([]);

  const funcionarioId = parseInt(params.id as string);
  const isAdmin = user?.roles.includes(Role.ADMIN) ?? false;
  const isReadOnly = !isAdmin;

  const { submitHandler, isSubmitting } = useFormSubmit({
    successMessage: "Funcionário atualizado com sucesso!",
    errorMessage: "Erro ao atualizar funcionário",
    redirectTo: BACK_PATH,
  });

  const methods = useForm<FuncionarioFormData>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(funcionarioSchema) as any,
  });

  useEffect(() => {
    const fetchFuncoes = async () => {
      const response = await funcaoService.list({
        limit: 100,
        ano: new Date().getFullYear(),
      });
      if (response.success && response.data) {
        setFuncoes(response.data.items);
      }
    };
    fetchFuncoes();
  }, []);

  useEffect(() => {
    const fetchFuncionario = async () => {
      try {
        const response = await funcionarioService.getById(funcionarioId);

        if (response.success && response.data) {
          const func = response.data;

          const formData: Partial<FuncionarioFormData> = {
            ...func,
            cpf: maskCpf(func.cpf),
            telefone: maskTelefone(func.telefone),
            recado: func.recado ? maskTelefone(func.recado) : "",
            dataNascimento: func.dataNascimento
              ? isoToDate(func.dataNascimento)
              : "",
            funcaoId: func.funcao?.id || func.funcaoId,
            documentacao: func.documentacao
              ? {
                  ...func.documentacao,
                  dataEmissao: func.documentacao.dataEmissao
                    ? isoToDate(func.documentacao.dataEmissao)
                    : "",
                }
              : undefined,
            dataFimContratoExperiencia: func.dataFimContratoExperiencia
              ? isoToDate(func.dataFimContratoExperiencia)
              : "",
            dataEncerramento: func.dataEncerramento
              ? isoToDate(func.dataEncerramento)
              : "",
          };

          setTemContaBancaria(!!func.contaBancaria);

          if (func.valeTransportes !== undefined) {
            (formData as Partial<FuncionarioFormData>).temValeTransporte =
              func.valeTransportes.length > 0;
            (formData as Partial<FuncionarioFormData>).valeTransportes =
              func.valeTransportes as FuncionarioFormData["valeTransportes"];
          }

          methods.reset(formData);

          if (func.documentacao?.id) {
            const { anexoFuncionarioService } =
              await import("@/src/services/anexo-funcionario.service");
            const anexosResponse =
              await anexoFuncionarioService.list(funcionarioId);

            if (anexosResponse.success && anexosResponse.data) {
              const API_URL =
                process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";
              const mappedAnexos: ExistingAnexo[] = anexosResponse.data
                .filter((anexo) => anexo.id !== undefined)
                .map((anexo) => ({
                  id: anexo.id!,
                  originalName: anexo.originalName,
                  mimeType: anexo.mimeType,
                  size: anexo.size,
                  tipo: anexo.tipo || TipoAnexoFuncionario.OUTRO,
                  uploadedAt: anexo.uploadedAt
                    ? typeof anexo.uploadedAt === "string"
                      ? anexo.uploadedAt
                      : anexo.uploadedAt.toISOString()
                    : new Date().toISOString(),
                  downloadUrl: `${API_URL}/anexo-funcionario/${funcionarioId}/${anexo.id}/download`,
                }));
              setExistingAnexos(mappedAnexos);
            }
          }
        } else {
          showToast({
            type: "error",
            message: response.message || "Erro ao carregar funcionário",
          });
          router.push(BACK_PATH);
        }
      } catch (error) {
        console.error(error);
        showToast({ type: "error", message: "Erro ao carregar funcionário" });
        router.push(BACK_PATH);
      } finally {
        setLoading(false);
      }
    };
    fetchFuncionario();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [funcionarioId]);

  const onSubmit = async (data: FuncionarioFormData) => {
    const payload = buildFuncionarioPayload(data, temContaBancaria, true);

    await submitHandler(
      () =>
        funcionarioService.update(
          funcionarioId,
          payload as UpdateFuncionarioDto
        ),
      async () => {
        await deleteAnexos(funcionarioId, anexosToDelete);
        await uploadAnexos(funcionarioId, pendingAnexos);
      }
    );
  };

  const handleRemoveExisting = (id: number) => {
    setAnexosToDelete([...anexosToDelete, id]);
    setExistingAnexos(existingAnexos.filter((a) => a.id !== id));
  };

  return (
    <FormPageShell
      title={isReadOnly ? "Visualizar Funcionário" : "Editar Funcionário"}
      backPath={BACK_PATH}
      loading={loading}
    >
      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-8">
          <FuncionarioForm
            funcoes={funcoes}
            isReadOnly={isReadOnly}
            isSubmitting={isSubmitting}
            temContaBancaria={temContaBancaria}
            setTemContaBancaria={setTemContaBancaria}
            pendingAnexos={pendingAnexos}
            setPendingAnexos={setPendingAnexos}
            existingAnexos={existingAnexos}
            onRemoveExisting={isReadOnly ? undefined : handleRemoveExisting}
            onCancel={() => router.push(BACK_PATH)}
            submitButtonText="Salvar Alterações"
            showSubmitButton={isAdmin}
          />
        </form>
      </FormProvider>
    </FormPageShell>
  );
}
