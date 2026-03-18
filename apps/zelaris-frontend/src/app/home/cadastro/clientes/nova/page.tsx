"use client";

import { clienteService } from "@/src/services/cliente.service";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  clienteSchema,
  type ClienteFormData,
} from "@/src/schemas/cliente.schema";
import { FormPageShell } from "@/src/app/components/layout/FormPageShell";
import { ClienteForm } from "../components/ClienteForm";
import { useFormSubmit } from "@/src/hooks/useFormSubmit";
import { buildClientePayload } from "../utils";

const BACK_PATH = "/home/cadastro/clientes";

export default function NovoClientePage() {
  const { submitHandler, isSubmitting } = useFormSubmit({
    successMessage: "Cliente criado com sucesso",
    errorMessage: "Erro ao criar cliente",
    redirectTo: BACK_PATH,
  });

  const methods = useForm<ClienteFormData>({
    resolver: zodResolver(clienteSchema),
    defaultValues: {
      pessoaJuridica: true,
      ativo: true,
      endereco: {
        numero: "",
        endereco: "",
        bairro: "",
        municipio: "",
        uf: "",
        cep: "",
      },
    },
  });

  const onSubmit = async (data: ClienteFormData) => {
    await submitHandler(() =>
      clienteService.create(buildClientePayload(data)),
    );
  };

  return (
    <FormPageShell title="Novo Cliente" backPath={BACK_PATH} maxWidth="max-w-4xl">
      <FormProvider {...methods}>
        <form
          onSubmit={methods.handleSubmit(onSubmit)}
          className="space-y-6"
        >
          <ClienteForm
            isSubmitting={isSubmitting}
            onCancel={() => history.back()}
            submitButtonText="Criar Cliente"
          />
        </form>
      </FormProvider>
    </FormPageShell>
  );
}
