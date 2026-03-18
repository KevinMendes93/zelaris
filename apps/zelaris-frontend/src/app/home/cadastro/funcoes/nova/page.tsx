"use client";

import { funcaoService } from "@/src/services/funcao.service";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { funcaoSchema, type FuncaoFormData } from "@/src/schemas/funcao.schema";
import { FormPageShell } from "@/src/app/components/layout/FormPageShell";
import { FuncaoForm } from "../components/FuncaoForm";
import { useFormSubmit } from "@/src/hooks/useFormSubmit";

const BACK_PATH = "/home/cadastro/funcoes";

export default function NovaFuncaoPage() {
  const { submitHandler, isSubmitting } = useFormSubmit({
    successMessage: "Função criada com sucesso",
    errorMessage: "Erro ao criar função",
    redirectTo: BACK_PATH,
  });

  const methods = useForm<FuncaoFormData>({
    resolver: zodResolver(funcaoSchema),
  });

  const onSubmit = async (data: FuncaoFormData) => {
    await submitHandler(() => funcaoService.create(data));
  };

  return (
    <FormPageShell
      title="Nova Função"
      backPath={BACK_PATH}
      maxWidth="max-w-2xl"
    >
      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-6">
          <FuncaoForm
            isSubmitting={isSubmitting}
            onCancel={() => history.back()}
            submitButtonText="Salvar"
          />
        </form>
      </FormProvider>
    </FormPageShell>
  );
}
