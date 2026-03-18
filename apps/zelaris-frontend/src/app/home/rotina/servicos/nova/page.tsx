"use client";

import { servicoService } from "@/src/services/servico.service";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  servicoSchema,
  type ServicoFormData,
} from "@/src/schemas/servico.schema";
import { useState, useEffect } from "react";
import { useToast } from "@/src/app/components/ui/ToastProvider";
import { StatusServico } from "@/src/enums";
import { clienteService } from "@/src/services/cliente.service";
import type { Cliente } from "@/src/models/cliente.model";
import { FormPageShell } from "@/src/app/components/layout/FormPageShell";
import { ServicoForm } from "../components/ServicoForm";
import { useFormSubmit } from "@/src/hooks/useFormSubmit";
import { buildServicoPayload } from "../utils";

const BACK_PATH = "/home/rotina/servicos";

export default function NovoServicoPage() {
  const { showToast } = useToast();
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [loadingClientes, setLoadingClientes] = useState(true);

  const { submitHandler, isSubmitting } = useFormSubmit({
    successMessage: "Serviço criado com sucesso",
    errorMessage: "Erro ao criar serviço",
    redirectTo: BACK_PATH,
  });

  const methods = useForm({
    resolver: zodResolver(servicoSchema),
    defaultValues: {
      status: StatusServico.AGENDADO,
      descricao: "",
      observacao: "",
      valor: 0,
      data_inicio: "",
      hora_inicio: "",
      data_fim: "",
      hora_fim: "",
    },
  });

  useEffect(() => {
    const fetchClientes = async () => {
      try {
        const response = await clienteService.list({
          limit: 1000,
          sortBy: "nome",
          sortOrder: "ASC",
          ativo: true,
        });
        if (response.success && response.data) {
          setClientes(response.data.items);
        }
      } catch (error) {
        console.error("Erro ao carregar clientes:", error);
        showToast({ type: "error", message: "Erro ao carregar clientes" });
      } finally {
        setLoadingClientes(false);
      }
    };
    fetchClientes();
  }, [showToast]);

  const onSubmit = async (data: ServicoFormData) => {
    await submitHandler(() => servicoService.create(buildServicoPayload(data)));
  };

  return (
    <FormPageShell
      title="Novo Serviço"
      backPath={BACK_PATH}
      maxWidth="max-w-4xl"
    >
      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-6">
          <ServicoForm
            isSubmitting={isSubmitting}
            onCancel={() => history.back()}
            submitButtonText="Criar Serviço"
            clientes={clientes}
            loadingClientes={loadingClientes}
          />
        </form>
      </FormProvider>
    </FormPageShell>
  );
}
