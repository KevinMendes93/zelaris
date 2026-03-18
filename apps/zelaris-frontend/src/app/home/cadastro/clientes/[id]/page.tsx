"use client";

import { clienteService } from "@/src/services/cliente.service";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  clienteSchema,
  type ClienteFormData,
} from "@/src/schemas/cliente.schema";
import { useRouter, useParams } from "next/navigation";
import { useState, useEffect } from "react";
import { useToast } from "@/src/app/components/ui/ToastProvider";
import { useAuth } from "@/src/app/auth/hooks/useAuth";
import { Role } from "@/src/models/user.model";
import { formatCpf, formatCnpj, maskTelefone } from "@/src/lib/formatters";
import { FormPageShell } from "@/src/app/components/layout/FormPageShell";
import { ClienteForm } from "../components/ClienteForm";
import { useFormSubmit } from "@/src/hooks/useFormSubmit";
import { buildClientePayload } from "../utils";

const BACK_PATH = "/home/cadastro/clientes";

export default function EditarClientePage() {
  const router = useRouter();
  const params = useParams();
  const { showToast } = useToast();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);

  const clienteId = parseInt(params.id as string);
  const isAdmin = user?.roles.includes(Role.ADMIN) ?? false;
  const isReadOnly = !isAdmin;

  const { submitHandler, isSubmitting } = useFormSubmit({
    successMessage: "Cliente atualizado com sucesso",
    errorMessage: "Erro ao atualizar cliente",
    redirectTo: BACK_PATH,
  });

  const methods = useForm<ClienteFormData>({
    resolver: zodResolver(clienteSchema),
    defaultValues: {
      pessoaJuridica: true,
      ativo: true,
    },
  });

  useEffect(() => {
    const fetchCliente = async () => {
      try {
        const response = await clienteService.getById(clienteId);
        if (response.success && response.data) {
          const cliente = response.data;
          methods.reset({
            ...cliente,
            documento: cliente.pessoaJuridica
              ? formatCnpj(cliente.documento)
              : formatCpf(cliente.documento),
            telefone: maskTelefone(cliente.telefone),
          });
        } else {
          showToast({
            type: "error",
            message: response.message || "Erro ao carregar cliente",
          });
          router.push(BACK_PATH);
        }
      } catch (error) {
        console.error(error);
        showToast({ type: "error", message: "Erro ao carregar cliente" });
        router.push(BACK_PATH);
      } finally {
        setLoading(false);
      }
    };
    fetchCliente();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clienteId]);

  const onSubmit = async (data: ClienteFormData) => {
    await submitHandler(() =>
      clienteService.update(clienteId, buildClientePayload(data))
    );
  };

  return (
    <FormPageShell
      title={isReadOnly ? "Visualizar Cliente" : "Editar Cliente"}
      backPath={BACK_PATH}
      maxWidth="max-w-4xl"
      loading={loading}
    >
      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-6">
          <ClienteForm
            isReadOnly={isReadOnly}
            isSubmitting={isSubmitting}
            onCancel={() => router.push(BACK_PATH)}
            submitButtonText="Salvar Alterações"
            showSubmitButton={isAdmin}
          />
        </form>
      </FormProvider>
    </FormPageShell>
  );
}
