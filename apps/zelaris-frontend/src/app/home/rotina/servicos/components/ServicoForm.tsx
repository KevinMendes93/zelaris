"use client";

import { useFormContext } from "react-hook-form";
import type { ServicoFormData } from "@/src/schemas/servico.schema";
import { StatusServico, StatusServicoLabels } from "@/src/enums";
import { ClienteSelect } from "./ClienteSelect";
import { DataHoraFields } from "./DataHoraFields";
import type { Cliente } from "@/src/models/cliente.model";
import {
  currencyToNumber,
  formatCurrency,
  maskCurrency,
} from "@/src/lib/formatters";

interface ServicoFormProps {
  isReadOnly?: boolean;
  isSubmitting: boolean;
  onCancel: () => void;
  submitButtonText?: string;
  showSubmitButton?: boolean;
  clientes: Cliente[];
  loadingClientes: boolean;
}

export function ServicoForm({
  isReadOnly = false,
  isSubmitting,
  onCancel,
  submitButtonText = "Salvar",
  showSubmitButton = true,
  clientes,
  loadingClientes,
}: ServicoFormProps) {
  const {
    register,
    formState: { errors },
    setValue,
    watch,
  } = useFormContext<ServicoFormData>();

  const valor = watch("valor");

  const handleValorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = maskCurrency(e.target.value);
    setValue("valor", currencyToNumber(formatted));
  };

  return (
    <>
      {/* Dados Básicos */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-white border-b border-white/10 pb-2">
          Dados do Serviço
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Cliente */}
          <ClienteSelect
            isReadOnly={isReadOnly}
            clientes={clientes}
            loading={loadingClientes}
          />

          {/* Status */}
          <div>
            <label
              htmlFor="status"
              className="block text-sm font-medium text-white mb-2"
            >
              Status <span className="text-red-400">*</span>
            </label>
            <select
              id="status"
              disabled={isReadOnly}
              {...register("status")}
              className="w-full rounded-lg bg-white/95 text-gray-900 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#DB9437] disabled:opacity-60 disabled:cursor-not-allowed"
            >
              <option value="">Selecione um status</option>
              {Object.values(StatusServico).map((status) => (
                <option key={status} value={status}>
                  {StatusServicoLabels[status]}
                </option>
              ))}
            </select>
            {errors.status && (
              <p className="text-red-400 text-xs mt-1">
                {errors.status.message}
              </p>
            )}
          </div>
        </div>

        {/* Descrição */}
        <div>
          <label
            htmlFor="descricao"
            className="block text-sm font-medium text-white mb-2"
          >
            Descrição <span className="text-red-400">*</span>
          </label>
          <textarea
            id="descricao"
            placeholder="Descreva o serviço a ser realizado..."
            disabled={isReadOnly}
            rows={4}
            maxLength={1000}
            {...register("descricao")}
            className="w-full rounded-lg bg-white/95 text-gray-900 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#DB9437] placeholder:text-gray-400 disabled:opacity-60 disabled:cursor-not-allowed resize-none"
          />
          {errors.descricao && (
            <p className="text-red-400 text-xs mt-1">
              {errors.descricao.message}
            </p>
          )}
        </div>

        {/* Valor */}
        <div>
          <label
            htmlFor="valor"
            className="block text-sm font-medium text-white mb-2"
          >
            Valor (R$): <span className="text-red-400">*</span>
          </label>
          <input
            id="valor"
            type="text"
            placeholder="Ex: R$ 1000,00"
            disabled={isReadOnly}
            value={valor ? formatCurrency(valor) : ""}
            onChange={handleValorChange}
            className="w-full rounded-lg bg-white/95 text-gray-900 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#DB9437] placeholder:text-gray-400 disabled:opacity-60 disabled:cursor-not-allowed"
          />
          {errors.valor && (
            <p className="text-red-400 text-xs mt-1">{errors.valor.message}</p>
          )}
        </div>

        {/* Observação */}
        <div>
          <label
            htmlFor="observacao"
            className="block text-sm font-medium text-white mb-2"
          >
            Observação
          </label>
          <textarea
            id="observacao"
            placeholder="Observações adicionais (opcional)..."
            disabled={isReadOnly}
            rows={3}
            maxLength={1000}
            {...register("observacao")}
            className="w-full rounded-lg bg-white/95 text-gray-900 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#DB9437] placeholder:text-gray-400 disabled:opacity-60 disabled:cursor-not-allowed resize-none"
          />
          {errors.observacao && (
            <p className="text-red-400 text-xs mt-1">
              {errors.observacao.message}
            </p>
          )}
        </div>
      </div>

      {/* Data/Hora */}
      <DataHoraFields isReadOnly={isReadOnly} />

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
