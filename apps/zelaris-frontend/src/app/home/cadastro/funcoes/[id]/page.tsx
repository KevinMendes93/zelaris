"use client";

import { funcaoService } from "@/src/services/funcao.service";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { funcaoSchema, type FuncaoFormData } from "@/src/schemas/funcao.schema";
import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import { useToast } from "@/src/app/components/ui/ToastProvider";
import { useAuth } from "@/src/app/auth/hooks/useAuth";
import { Role } from "@/src/models/user.model";
import { FormPageShell } from "@/src/app/components/layout/FormPageShell";
import { FuncaoForm } from "../components/FuncaoForm";
import { useFormSubmit } from "@/src/hooks/useFormSubmit";
import { useRouter } from "next/navigation";

const BACK_PATH = "/home/cadastro/funcoes";

export default function EditarFuncaoPage() {
  const params = useParams();
  const router = useRouter();
  const { showToast } = useToast();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);

  const funcaoId = parseInt(params.id as string);
  const isAdmin = user?.roles.includes(Role.ADMIN) ?? false;
  const isReadOnly = !isAdmin;

  const { submitHandler, isSubmitting } = useFormSubmit({
    successMessage: "Função atualizada com sucesso",
    errorMessage: "Erro ao atualizar função",
    redirectTo: BACK_PATH,
  });

  const methods = useForm<FuncaoFormData>({
    resolver: zodResolver(funcaoSchema),
  });

  useEffect(() => {
    const fetchFuncao = async () => {
      try {
        const response = await funcaoService.getById(funcaoId);
        if (response.success && response.data) {
          methods.reset({
            nome: response.data.nome,
            salario: response.data.salario,
            anoVigente: response.data.anoVigente,
            tipoPagamento: response.data.tipoPagamento,
          });
        } else {
          showToast({
            type: "error",
            message: response.message || "Erro ao carregar função",
          });
          router.push(BACK_PATH);
        }
      } catch {
        showToast({ type: "error", message: "Erro ao carregar função" });
        router.push(BACK_PATH);
      } finally {
        setLoading(false);
      }
    };
    fetchFuncao();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [funcaoId]);

  const onSubmit = async (data: FuncaoFormData) => {
    await submitHandler(() => funcaoService.update(funcaoId, data));
  };

  return (
    <FormPageShell
      title={isReadOnly ? "Visualizar Função" : "Editar Função"}
      backPath={BACK_PATH}
      maxWidth="max-w-2xl"
      loading={loading}
    >
      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-6">
          <FuncaoForm
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
