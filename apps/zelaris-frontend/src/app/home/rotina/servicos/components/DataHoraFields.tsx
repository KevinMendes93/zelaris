"use client";

import { useFormContext } from "react-hook-form";
import type { ServicoFormData } from "@/src/schemas/servico.schema";

interface DataHoraFieldsProps {
  isReadOnly?: boolean;
}

export function DataHoraFields({ isReadOnly = false }: DataHoraFieldsProps) {
  const {
    register,
    formState: { errors },
  } = useFormContext<ServicoFormData>();

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-white border-b border-white/10 pb-2">
        Período do Serviço
      </h3>

      {/* Data/Hora Início */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label
            htmlFor="data_inicio"
            className="block text-sm font-medium text-white mb-2"
          >
            Data de Início <span className="text-red-400">*</span>
          </label>
          <input
            id="data_inicio"
            type="date"
            disabled={isReadOnly}
            {...register("data_inicio")}
            className="w-full rounded-lg bg-white/95 text-gray-900 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#DB9437] disabled:opacity-60 disabled:cursor-not-allowed"
          />
          {errors.data_inicio && (
            <p className="text-red-400 text-xs mt-1">
              {errors.data_inicio.message}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="hora_inicio"
            className="block text-sm font-medium text-white mb-2"
          >
            Hora de Início <span className="text-red-400">*</span>
          </label>
          <input
            id="hora_inicio"
            type="time"
            disabled={isReadOnly}
            {...register("hora_inicio")}
            className="w-full rounded-lg bg-white/95 text-gray-900 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#DB9437] disabled:opacity-60 disabled:cursor-not-allowed"
          />
          {errors.hora_inicio && (
            <p className="text-red-400 text-xs mt-1">
              {errors.hora_inicio.message}
            </p>
          )}
        </div>
      </div>

      {/* Data/Hora Fim */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label
            htmlFor="data_fim"
            className="block text-sm font-medium text-white mb-2"
          >
            Data de Fim
          </label>
          <input
            id="data_fim"
            type="date"
            disabled={isReadOnly}
            {...register("data_fim")}
            className="w-full rounded-lg bg-white/95 text-gray-900 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#DB9437] disabled:opacity-60 disabled:cursor-not-allowed"
          />
          {errors.data_fim && (
            <p className="text-red-400 text-xs mt-1">
              {errors.data_fim.message}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="hora_fim"
            className="block text-sm font-medium text-white mb-2"
          >
            Hora de Fim
          </label>
          <input
            id="hora_fim"
            type="time"
            disabled={isReadOnly}
            {...register("hora_fim")}
            className="w-full rounded-lg bg-white/95 text-gray-900 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#DB9437] disabled:opacity-60 disabled:cursor-not-allowed"
          />
          {errors.hora_fim && (
            <p className="text-red-400 text-xs mt-1">
              {errors.hora_fim.message}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
