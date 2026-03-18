"use client";

import { servicoService } from "@/src/services/servico.service";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  servicoSchema,
  type ServicoFormData,
} from "@/src/schemas/servico.schema";
import { useRouter, useParams } from "next/navigation";
import { useState, useEffect } from "react";
import { useToast } from "@/src/app/components/ui/ToastProvider";
import { useAuth } from "@/src/app/auth/hooks/useAuth";
import { Role } from "@/src/models/user.model";
import { clienteService } from "@/src/services/cliente.service";
import type { Cliente } from "@/src/models/cliente.model";
import { FormPageShell } from "@/src/app/components/layout/FormPageShell";
import { ServicoForm } from "../components/ServicoForm";
import { useFormSubmit } from "@/src/hooks/useFormSubmit";
import { buildServicoPayload } from "../utils";
import { isoToLocalDate, isoToLocalTime } from "@/src/lib/formatters";

const BACK_PATH = "/home/rotina/servicos";

export default function EditarServicoPage() {
  const router = useRouter();
  const params = useParams();
  const { showToast } = useToast();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [loadingClientes, setLoadingClientes] = useState(true);

  const servicoId = parseInt(params.id as string);
  const isAdmin = user?.roles.includes(Role.ADMIN) ?? false;
  const isReadOnly = !isAdmin;

  const { submitHandler, isSubmitting } = useFormSubmit({
    successMessage: "Serviço atualizado com sucesso",
    errorMessage: "Erro ao atualizar serviço",
    redirectTo: BACK_PATH,
  });

  const methods = useForm({
    resolver: zodResolver(servicoSchema),
  });

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const [servicoResponse, clientesResponse] = await Promise.all([
          servicoService.getById(servicoId),
          clienteService.list({
            limit: 1000,
            sortBy: "nome",
            sortOrder: "ASC",
            ativo: true,
          }),
        ]);

        if (clientesResponse.success && clientesResponse.data) {
          setClientes(clientesResponse.data.items);
        } else {
          showToast({
            type: "error",
            message: "Erro ao carregar a lista de clientes.",
          });
        }
        setLoadingClientes(false);

        if (servicoResponse.success && servicoResponse.data) {
          const servico = servicoResponse.data;

          methods.reset({
            descricao: servico.descricao,
            data_inicio: isoToLocalDate(servico.data_hora_inicio),
            hora_inicio: isoToLocalTime(servico.data_hora_inicio),
            data_fim: isoToLocalDate(servico.data_hora_fim ?? ""),
            hora_fim: isoToLocalTime(servico.data_hora_fim ?? ""),
            valor: servico.valor,
            status: servico.status,
            observacao: servico.observacao || "",
            clienteId: servico.cliente?.id || 0,
          });
        } else {
          showToast({
            type: "error",
            message: servicoResponse.message || "Erro ao carregar serviço",
          });
          router.push(BACK_PATH);
        }
      } catch (error) {
        console.error("Erro ao carregar dados:", error);
        showToast({
          type: "error",
          message: "Erro ao carregar dados da página",
        });
        router.push(BACK_PATH);
      } finally {
        setLoading(false);
      }
    };
    fetchInitialData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [servicoId]);

  const onSubmit = async (data: ServicoFormData) => {
    await submitHandler(() =>
      servicoService.update(servicoId, buildServicoPayload(data))
    );
  };

  return (
    <FormPageShell
      title={isReadOnly ? "Visualizar Serviço" : "Editar Serviço"}
      backPath={BACK_PATH}
      maxWidth="max-w-4xl"
      loading={loading}
    >
      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-6">
          <ServicoForm
            isReadOnly={isReadOnly}
            isSubmitting={isSubmitting}
            onCancel={() => router.push(BACK_PATH)}
            submitButtonText="Salvar Alterações"
            showSubmitButton={isAdmin}
            clientes={clientes}
            loadingClientes={loadingClientes}
          />
        </form>
      </FormProvider>
    </FormPageShell>
  );
}
