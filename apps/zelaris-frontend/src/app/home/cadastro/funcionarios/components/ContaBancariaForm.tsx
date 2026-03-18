"use client";

import { useFormContext } from "react-hook-form";
import type { FuncionarioFormData } from "@/src/schemas/funcionario.schema";
import { TipoConta } from "@/src/enums";
import { useEffect } from "react";

interface ContaBancariaFormProps {
  enabled: boolean;
  onToggle: (enabled: boolean) => void;
  isReadOnly: boolean;
}

export function ContaBancariaForm({
  enabled,
  onToggle,
  isReadOnly,
}: ContaBancariaFormProps) {
  const {
    register,
    formState: { errors },
    resetField,
    setValue,
    clearErrors,
  } = useFormContext<FuncionarioFormData>();

  useEffect(() => {
    if (!enabled) {
      resetField("contaBancaria");
      setValue("contaBancaria", null);
      clearErrors("contaBancaria");
    }
  }, [enabled, resetField, clearErrors, setValue]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between border-b border-white/10 pb-2">
        <h3 className="text-lg font-semibold text-white">Conta Bancária</h3>
        {!isReadOnly ? (
          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="checkbox"
              checked={enabled}
              onChange={(e) => onToggle(e.target.checked)}
              className="w-5 h-5 rounded text-[#DB9437] focus:ring-2 focus:ring-[#DB9437]"
            />
            <span className="text-sm text-white/90">Adicionar conta</span>
          </label>
        ) : (
          <span className="text-sm text-white/60">
            {enabled ? "Sim" : "Não"}
          </span>
        )}
      </div>

      {enabled && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label
                htmlFor="contaBancaria.tipoConta"
                className="block text-sm font-medium text-white mb-2"
              >
                Tipo de Conta <span className="text-red-400">*</span>
              </label>
              <select
                id="contaBancaria.tipoConta"
                disabled={isReadOnly}
                {...register("contaBancaria.tipoConta")}
                className="w-full rounded-lg bg-white/95 text-gray-900 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#DB9437] disabled:opacity-60 disabled:cursor-not-allowed"
              >
                <option value="">Selecione...</option>
                {Object.values(TipoConta).map((tipo) => (
                  <option key={tipo} value={tipo}>
                    {tipo}
                  </option>
                ))}
              </select>
                {errors.contaBancaria?.tipoConta && (
                  <p className="text-red-400 text-xs mt-1">
                    {errors.contaBancaria?.tipoConta.message}
                  </p>
                )}
            </div>
            <div className="md:col-span-2">
              <label
                htmlFor="contaBancaria.banco"
                className="block text-sm font-medium text-white mb-2"
              >
                Banco <span className="text-red-400">*</span>
              </label>
              <input
                id="contaBancaria.banco"
                type="text"
                placeholder="Ex: Banco do Brasil"
                disabled={isReadOnly}
                {...register("contaBancaria.banco")}
                className="w-full rounded-lg bg-white/95 text-gray-900 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#DB9437] placeholder:text-gray-400 disabled:opacity-60 disabled:cursor-not-allowed"
              />
              {errors.contaBancaria?.banco && (
                <p className="text-red-400 text-xs mt-1">
                  {errors.contaBancaria.banco.message}
                </p>
              )}
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
            <div>
              <label
                htmlFor="contaBancaria.agencia"
                className="block text-sm font-medium text-white mb-2"
              >
                Agência <span className="text-red-400">*</span>
              </label>
              <input
                id="contaBancaria.agencia"
                type="text"
                placeholder="Ex: 1234"
                disabled={isReadOnly}
                {...register("contaBancaria.agencia")}
                className="w-full rounded-lg bg-white/95 text-gray-900 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#DB9437] placeholder:text-gray-400 disabled:opacity-60 disabled:cursor-not-allowed"
              />
              {errors.contaBancaria?.agencia && (
                <p className="text-red-400 text-xs mt-1">
                  {errors.contaBancaria.agencia.message}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="contaBancaria.agenciaDigito"
                className="block text-sm font-medium text-white mb-2"
              >
                Dígito Agência
              </label>
              <input
                id="contaBancaria.agenciaDigito"
                type="text"
                placeholder="Ex: 0"
                maxLength={2}
                disabled={isReadOnly}
                {...register("contaBancaria.agenciaDigito")}
                className="w-full rounded-lg bg-white/95 text-gray-900 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#DB9437] placeholder:text-gray-400 disabled:opacity-60 disabled:cursor-not-allowed"
              />
            </div>

            <div>
              <label
                htmlFor="contaBancaria.conta"
                className="block text-sm font-medium text-white mb-2"
              >
                Conta <span className="text-red-400">*</span>
              </label>
              <input
                id="contaBancaria.conta"
                type="text"
                placeholder="Ex: 12345678"
                disabled={isReadOnly}
                {...register("contaBancaria.conta")}
                className="w-full rounded-lg bg-white/95 text-gray-900 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#DB9437] placeholder:text-gray-400 disabled:opacity-60 disabled:cursor-not-allowed"
              />
              {errors.contaBancaria?.conta && (
                <p className="text-red-400 text-xs mt-1">
                  {errors.contaBancaria.conta.message}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="contaBancaria.contaDigito"
                className="block text-sm font-medium text-white mb-2"
              >
                Dígito Conta
              </label>
              <input
                id="contaBancaria.contaDigito"
                type="text"
                placeholder="Ex: 0"
                maxLength={2}
                disabled={isReadOnly}
                {...register("contaBancaria.contaDigito")}
                className="w-full rounded-lg bg-white/95 text-gray-900 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#DB9437] placeholder:text-gray-400 disabled:opacity-60 disabled:cursor-not-allowed"
              />
            </div>
          </div>
        </>
      )}
    </div>
  );
}
