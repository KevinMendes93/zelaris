"use client";

import {
  useFormContext,
  useFieldArray,
  useWatch,
  type Control,
} from "react-hook-form";
import { useEffect } from "react";
import type { FuncionarioFormData } from "@/src/schemas/funcionario.schema";
import { TipoConducao, MeioTransporte } from "@/src/enums";

interface ValeTransporteFormProps {
  enabled: boolean;
  onToggle: (enabled: boolean) => void;
  isReadOnly?: boolean;
}

interface ValeItemProps {
  index: number;
  control: Control<FuncionarioFormData>;
  isReadOnly: boolean;
  onRemove: () => void;
}

function ValeItem({ index, control, isReadOnly, onRemove }: ValeItemProps) {
  const {
    register,
    setValue,
    clearErrors,
    formState: { errors },
  } = useFormContext<FuncionarioFormData>();

  const itemErrors = errors.valeTransportes?.[index];

  const quantidade = useWatch({
    control,
    name: `valeTransportes.${index}.quantidade`,
  });
  const valorUnitario = useWatch({
    control,
    name: `valeTransportes.${index}.valorUnitario`,
  });

  useEffect(() => {
    const quantidadeDescrita = Number(quantidade);
    const valorDescrito = Number(valorUnitario);
    if (quantidadeDescrita > 0 && valorDescrito > 0) {
      setValue(
        `valeTransportes.${index}.valorTotal`,
        parseFloat((quantidadeDescrita * valorDescrito).toFixed(2)),
      );
      clearErrors(`valeTransportes.${index}.valorTotal`);
    }
  }, [quantidade, valorUnitario, index, setValue, clearErrors]);

  return (
    <div className="border border-white/10 rounded-lg p-4 space-y-3 bg-white/5">
      {/* Cabeçalho do item */}
      <div className="flex items-center justify-between">
        <span className="text-sm font-semibold text-white/80">
          Vale {index + 1}
        </span>
        {!isReadOnly && (
          <button
            type="button"
            onClick={onRemove}
            className="text-red-400 hover:text-red-300 text-xs font-medium transition"
          >
            Remover
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Tipo de Condução */}
        <div>
          <label className="block text-sm font-medium text-white mb-2">
            Tipo de Condução <span className="text-red-400">*</span>
          </label>
          <select
            {...register(`valeTransportes.${index}.tipoConducao`)}
            disabled={isReadOnly}
            className="w-full rounded-lg bg-white/95 text-gray-900 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#DB9437] disabled:opacity-60 disabled:cursor-not-allowed [&>option]:bg-white [&>option]:text-gray-900"
          >
            <option value="">Selecione...</option>
            {Object.values(TipoConducao).map((tipo) => (
              <option key={tipo} value={tipo}>
                {tipo}
              </option>
            ))}
          </select>
          {itemErrors?.tipoConducao && (
            <p className="text-red-400 text-xs mt-1">
              {itemErrors.tipoConducao.message}
            </p>
          )}
        </div>

        {/* Meio de Transporte */}
        <div>
          <label className="block text-sm font-medium text-white mb-2">
            Meio de Transporte <span className="text-red-400">*</span>
          </label>
          <select
            {...register(`valeTransportes.${index}.meioTransporte`)}
            disabled={isReadOnly}
            className="w-full rounded-lg bg-white/95 text-gray-900 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#DB9437] disabled:opacity-60 disabled:cursor-not-allowed [&>option]:bg-white [&>option]:text-gray-900"
          >
            <option value="">Selecione...</option>
            {Object.values(MeioTransporte).map((meio) => (
              <option key={meio} value={meio}>
                {meio}
              </option>
            ))}
          </select>
          {itemErrors?.meioTransporte && (
            <p className="text-red-400 text-xs mt-1">
              {itemErrors.meioTransporte.message}
            </p>
          )}
        </div>

        {/* Quantidade */}
        <div>
          <label className="block text-sm font-medium text-white mb-2">
            Quantidade <span className="text-red-400">*</span>
          </label>
          <input
            type="number"
            min="1"
            placeholder="Ex: 44"
            disabled={isReadOnly}
            {...register(`valeTransportes.${index}.quantidade`, {
              valueAsNumber: true,
            })}
            className="w-full rounded-lg bg-white/95 text-gray-900 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#DB9437] placeholder:text-gray-400 disabled:opacity-60 disabled:cursor-not-allowed"
          />
          {itemErrors?.quantidade && (
            <p className="text-red-400 text-xs mt-1">
              {itemErrors.quantidade.message}
            </p>
          )}
        </div>

        {/* Valor Unitário */}
        <div>
          <label className="block text-sm font-medium text-white mb-2">
            Valor Unitário (R$) <span className="text-red-400">*</span>
          </label>
          <input
            type="number"
            step="0.01"
            min="0.01"
            placeholder="Ex: 4.50"
            disabled={isReadOnly}
            {...register(`valeTransportes.${index}.valorUnitario`, {
              valueAsNumber: true,
            })}
            className="w-full rounded-lg bg-white/95 text-gray-900 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#DB9437] placeholder:text-gray-400 disabled:opacity-60 disabled:cursor-not-allowed"
          />
          {itemErrors?.valorUnitario && (
            <p className="text-red-400 text-xs mt-1">
              {itemErrors.valorUnitario.message}
            </p>
          )}
        </div>

        {/* Valor Total (calculado automaticamente) */}
        <div>
          <label className="block text-sm font-medium text-white mb-2">
            Valor Total (R$){" "}
            <span className="text-gray-400 text-xs">(calculado)</span>
          </label>
          <input
            type="number"
            step="0.01"
            readOnly
            {...register(`valeTransportes.${index}.valorTotal`, {
              valueAsNumber: true,
            })}
            className="w-full rounded-lg bg-white/50 text-gray-900 px-4 py-3 text-sm focus:outline-none cursor-not-allowed"
          />
          {itemErrors?.valorTotal && (
            <p className="text-red-400 text-xs mt-1">
              {itemErrors.valorTotal.message}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export function ValeTransporteForm({
  enabled,
  onToggle,
  isReadOnly = false,
}: ValeTransporteFormProps) {
  const {
    formState: { errors },
    setValue,
    clearErrors,
    control,
  } = useFormContext<FuncionarioFormData>();

  const { fields, append, remove } = useFieldArray({
    control,
    name: "valeTransportes",
  });

  useEffect(() => {
    if (!enabled) {
      setValue("valeTransportes", []);
      clearErrors("valeTransportes");
    }
  }, [enabled, setValue, clearErrors]);

  const listError = errors.valeTransportes?.root?.message
    ?? (errors.valeTransportes as { message?: string } | undefined)?.message;

  return (
    <div className="space-y-4">
      {/* Header com toggle */}
      <div className="flex items-center justify-between border-b border-white/10 pb-2">
        <h3 className="text-lg font-semibold text-white">Vale Transporte</h3>
        {!isReadOnly ? (
          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="checkbox"
              checked={enabled}
              onChange={(e) => onToggle(e.target.checked)}
              className="w-5 h-5 rounded text-[#DB9437] focus:ring-2 focus:ring-[#DB9437]"
            />
            <span className="text-sm text-white/90">Tem vale transporte</span>
          </label>
        ) : (
          <span className="text-sm text-white/60">{enabled ? "Sim" : "Não"}</span>
        )}
      </div>

      {/* Erro geral da lista */}
      {enabled && listError && (
        <p className="text-red-400 text-xs">{listError}</p>
      )}

      {enabled && (
        <div className="space-y-4">
          {fields.map((field, index) => (
            <ValeItem
              key={field.id}
              index={index}
              control={control}
              isReadOnly={isReadOnly}
              onRemove={() => remove(index)}
            />
          ))}

          {/* Botão de adicionar novo vale */}
          {!isReadOnly && (
            <button
              type="button"
              onClick={() =>
                append({
                  tipoConducao: "" as never,
                  meioTransporte: "" as never,
                  quantidade: 0,
                  valorUnitario: 0,
                  valorTotal: 0,
                })
              }
              className="w-full py-2.5 rounded-lg border border-dashed border-[#DB9437]/50 text-[#DB9437] hover:bg-[#DB9437]/10 text-sm font-medium transition"
            >
              + Adicionar Vale Transporte
            </button>
          )}

          {fields.length === 0 && isReadOnly && (
            <p className="text-white/40 text-sm text-center py-2">
              Nenhum vale cadastrado.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
