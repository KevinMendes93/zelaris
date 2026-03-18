"use client";

import { funcionarioService } from "@/src/services/funcionario.service";
import { funcaoService } from "@/src/services/funcao.service";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  funcionarioSchema,
  type FuncionarioFormData,
} from "@/src/schemas/funcionario.schema";
import { useState, useEffect } from "react";
import { FormPageShell } from "@/src/app/components/layout/FormPageShell";
import { FuncionarioForm } from "../components/FuncionarioForm";
import { useFormSubmit } from "@/src/hooks/useFormSubmit";
import { buildFuncionarioPayload, uploadAnexos } from "../utils";
import { type PendingAnexo } from "../components/AnexoUpload";
import type { Funcao } from "@/src/models/funcao.model";
import type { CreateFuncionarioDto } from "@/src/models/funcionario.model";

const BACK_PATH = "/home/cadastro/funcionarios";

export default function NovoFuncionarioPage() {
  const [funcoes, setFuncoes] = useState<Funcao[]>([]);
  const [temContaBancaria, setTemContaBancaria] = useState(false);
  const [pendingAnexos, setPendingAnexos] = useState<PendingAnexo[]>([]);

  const { submitHandler, isSubmitting } = useFormSubmit({
    successMessage: "Funcionário criado com sucesso!",
    errorMessage: "Erro ao criar funcionário",
    redirectTo: BACK_PATH,
  });

  const methods = useForm<FuncionarioFormData>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(funcionarioSchema) as any,
    defaultValues: {
      freelancer: false,
      temValeTransporte: false,
      dependentesIR: 0,
      filhosMenores14: 0,
      endereco: {
        endereco: "",
        bairro: "",
        municipio: "",
        uf: "",
        cep: "",
      },
      documentacao: {
        identidade: "",
        orgaoEmissor: undefined,
        dataEmissao: "",
        ctps: "",
        serie: "",
        pis: "",
        tituloEleitor: "",
        zonaEleitoral: "",
      },
    },
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

  const onSubmit = async (data: FuncionarioFormData) => {
    const payload = buildFuncionarioPayload(data, temContaBancaria);

    await submitHandler(
      () => funcionarioService.create(payload as CreateFuncionarioDto),
      async (response) => {
        await uploadAnexos(response.data.id!, pendingAnexos);
      }
    );
  };

  return (
    <FormPageShell title="Novo Funcionário" backPath={BACK_PATH}>
      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-8">
          <FuncionarioForm
            funcoes={funcoes}
            isSubmitting={isSubmitting}
            temContaBancaria={temContaBancaria}
            setTemContaBancaria={setTemContaBancaria}
            pendingAnexos={pendingAnexos}
            setPendingAnexos={setPendingAnexos}
            onCancel={() => history.back()}
            submitButtonText="Criar Funcionário"
          />
        </form>
      </FormProvider>
    </FormPageShell>
  );
}
