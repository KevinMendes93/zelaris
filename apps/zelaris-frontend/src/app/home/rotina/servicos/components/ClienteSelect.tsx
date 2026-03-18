"use client";

import { useFormContext } from "react-hook-form";
import type { ServicoFormData } from "@/src/schemas/servico.schema";
import type { Cliente } from "@/src/models/cliente.model";

interface ClienteSelectProps {
  isReadOnly?: boolean;
  clientes: Cliente[];
  loading: boolean;
}

export function ClienteSelect({
  isReadOnly = false,
  clientes,
  loading,
}: ClienteSelectProps) {
  const {
    register,
    formState: { errors },
  } = useFormContext<ServicoFormData>();

  return (
    <div>
      <label
        htmlFor="clienteId"
        className="block text-sm font-medium text-white mb-2"
      >
        Cliente <span className="text-red-400">*</span>
      </label>
      <select
        id="clienteId"
        {...register("clienteId")}
        disabled={isReadOnly || loading}
        className="w-full rounded-lg bg-white/95 text-gray-900 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#DB9437] disabled:opacity-60 disabled:cursor-not-allowed"
      >
        <option value="">
          {loading ? "Carregando..." : "Selecione um cliente"}
        </option>
        {clientes.map((cliente) => (
          <option key={cliente.id} value={cliente.id}>
            {cliente.nome}
          </option>
        ))}
      </select>
      {errors.clienteId && (
        <p className="text-red-400 text-xs mt-1">{errors.clienteId.message}</p>
      )}
    </div>
  );
}
