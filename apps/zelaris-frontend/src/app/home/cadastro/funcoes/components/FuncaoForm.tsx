"use client";

import { useFormContext } from "react-hook-form";
import type { FuncaoFormData } from "@/src/schemas/funcao.schema";
import { TipoPagamento } from "@/src/enums";
import { currencyToNumber, formatCurrency, maskCurrency } from "@/src/lib/formatters";

interface FuncaoFormProps {
  isReadOnly?: boolean;
  isSubmitting: boolean;
  onCancel: () => void;
  submitButtonText?: string;
  showSubmitButton?: boolean;
}

export function FuncaoForm({
  isReadOnly = false,
  isSubmitting,
  onCancel,
  submitButtonText = "Salvar",
  showSubmitButton = true,
}: FuncaoFormProps) {
  const {
    register,
    formState: { errors },
    setValue,
    watch,
  } = useFormContext<FuncaoFormData>();

    const salario = watch("salario");

    const handleSalarioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = maskCurrency(e.target.value);
    setValue("salario", currencyToNumber(formatted));
  };

  const inputClass =
    "w-full rounded-lg bg-white/95 text-gray-900 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#DB9437] placeholder:text-gray-400 disabled:opacity-60 disabled:cursor-not-allowed";

  return (
    <>
      <div className="space-y-6">
        <div>
          <label
            htmlFor="nome"
            className="block text-sm font-medium text-white mb-2"
          >
            Nome da Função: <span className="text-red-400">*</span>
          </label>
          <input
            id="nome"
            type="text"
            placeholder="Ex: Gerente de Projetos"
            {...register("nome")}
            className={inputClass}
            disabled={isReadOnly}
          />
          {errors.nome && (
            <p className="text-red-400 text-xs mt-1">{errors.nome.message}</p>
          )}
        </div>

        <div>
          <label
            htmlFor="salario"
            className="block text-sm font-medium text-white mb-2"
          >
            Salário (R$): <span className="text-red-400">*</span>
          </label>
          <input
            id="salario"
            type="text"
            placeholder="Ex: R$ 5000,00"
            value={salario ? formatCurrency(salario) : ""}
            onChange={handleSalarioChange}
            className={inputClass}
            disabled={isReadOnly}
          />
          {errors.salario && (
            <p className="text-red-400 text-xs mt-1">
              {errors.salario.message}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="tipoPagamento"
            className="block text-sm font-medium text-white mb-2"
          >
            Tipo de Pagamento: <span className="text-red-400">*</span>
          </label>
          <select
            id="tipoPagamento"
            {...register("tipoPagamento")}
            className={inputClass}
            disabled={isReadOnly}
          >
            <option value={TipoPagamento.MENSAL}>Mensal</option>
            <option value={TipoPagamento.DIARIA}>Diaria</option>
          </select>
          {errors.tipoPagamento && (
            <p className="text-red-400 text-xs mt-1">
              {errors.tipoPagamento.message}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="anoVigente"
            className="block text-sm font-medium text-white mb-2"
          >
            Ano Vigente: <span className="text-red-400">*</span>
          </label>
          <input
            id="anoVigente"
            type="number"
            placeholder="Ex: 2026"
            defaultValue={new Date().getFullYear().toString()}
            {...register("anoVigente", { valueAsNumber: true })}
            className={inputClass}
            disabled={isReadOnly}
          />
          {errors.anoVigente && (
            <p className="text-red-400 text-xs mt-1">
              {errors.anoVigente.message}
            </p>
          )}
        </div>
      </div>

      {/* Botões */}
      <div className="flex gap-4 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 bg-gray-600 hover:bg-gray-500 text-white font-semibold py-3 rounded-lg transition"
        >
          {isReadOnly ? "Fechar" : "Cancelar"}
        </button>
        {showSubmitButton && (
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex-1 bg-[#DB9437] hover:bg-[#c7812e] disabled:bg-[#DB9437]/50 text-white font-semibold py-3 rounded-lg transition"
          >
            {isSubmitting ? "Salvando..." : submitButtonText}
          </button>
        )}
      </div>
    </>
  );
}
