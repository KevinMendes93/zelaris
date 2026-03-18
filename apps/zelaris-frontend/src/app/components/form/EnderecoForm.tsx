"use client";

import { useState } from "react";
import { useFormContext } from "react-hook-form";
import type { EnderecoFormData } from "@/src/schemas/endereco.schema";
import { maskCep } from "@/src/lib/formatters";
import { cepService } from "@/src/services/cep.service";

type FormWithEndereco = Record<string, unknown> & {
  endereco: EnderecoFormData;
};

export function EnderecoForm({ isReadOnly = false }) {
  const {
    register,
    formState: { errors },
    watch,
    setValue,
  } = useFormContext<FormWithEndereco>();

  const cep = watch("endereco.cep");
  const [isBuscandoCep, setIsBuscandoCep] = useState(false);

  const handleCepChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const valorFormatado = maskCep(e.target.value);
    setValue("endereco.cep", valorFormatado);

    const cepLimpo = valorFormatado.replace(/\D/g, "");
    if (cepLimpo.length === 8) {
      setIsBuscandoCep(true);
      const endereco = await cepService.buscarPorCep(cepLimpo);

      if (endereco) {
        setValue("endereco.endereco", endereco.logradouro || "");
        setValue("endereco.bairro", endereco.bairro || "");
        setValue("endereco.municipio", endereco.localidade || "");
        setValue("endereco.uf", endereco.uf || "");
      }
      setIsBuscandoCep(false);
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-white border-b border-white/10 pb-2">
        Endereço <span className="text-red-400">*</span>
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
          <label
            htmlFor="endereco.cep"
            className="block text-sm font-medium text-white mb-2"
          >
            CEP <span className="text-red-400">*</span>
            {isBuscandoCep && (
              <span className="ml-2 text-xs text-gray-400">Buscando...</span>
            )}
          </label>
          <input
            id="endereco.cep"
            type="text"
            placeholder="12345-678"
            disabled={isReadOnly}
            maxLength={9}
            value={cep || ""}
            onChange={handleCepChange}
            className="w-full rounded-lg bg-white/95 text-gray-900 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#DB9437] placeholder:text-gray-400 disabled:opacity-60 disabled:cursor-not-allowed"
          />
          {errors.endereco?.cep && (
            <p className="text-red-400 text-xs mt-1">
              {errors.endereco.cep.message}
            </p>
          )}
        </div>

        <div className="md:col-span-2">
          <label
            htmlFor="endereco.endereco"
            className="block text-sm font-medium text-white mb-2"
          >
            Endereço <span className="text-red-400">*</span>
          </label>
          <input
            id="endereco.endereco"
            type="text"
            placeholder="Ex: Rua das Flores, 123"
            disabled={isReadOnly}
            {...register("endereco.endereco")}
            className="w-full rounded-lg bg-white/95 text-gray-900 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#DB9437] placeholder:text-gray-400 disabled:opacity-60 disabled:cursor-not-allowed"
          />
          {errors.endereco?.endereco && (
            <p className="text-red-400 text-xs mt-1">
              {errors.endereco.endereco.message}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="endereco.numero"
            className="block text-sm font-medium text-white mb-2"
          >
            Número <span className="text-red-400">*</span>
          </label>
          <input
            id="endereco.numero"
            type="text"
            placeholder="Ex: 123"
            maxLength={10}
            disabled={isReadOnly}
            {...register("endereco.numero")}
            className="w-full rounded-lg bg-white/95 text-gray-900 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#DB9437] placeholder:text-gray-400 disabled:opacity-60 disabled:cursor-not-allowed"
          />
          {errors.endereco?.numero && (
            <p className="text-red-400 text-xs mt-1">
              {errors.endereco.numero.message}
            </p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <div className="md:col-span-2">
          <label
            htmlFor="endereco.bairro"
            className="block text-sm font-medium text-white mb-2"
          >
            Bairro <span className="text-red-400">*</span>
          </label>
          <input
            id="endereco.bairro"
            type="text"
            placeholder="Ex: Centro"
            disabled={isReadOnly}
            {...register("endereco.bairro")}
            className="w-full rounded-lg bg-white/95 text-gray-900 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#DB9437] placeholder:text-gray-400 disabled:opacity-60 disabled:cursor-not-allowed"
          />
          {errors.endereco?.bairro && (
            <p className="text-red-400 text-xs mt-1">
              {errors.endereco.bairro.message}
            </p>
          )}
        </div>

        <div className="md:col-span-2">
          <label
            htmlFor="endereco.municipio"
            className="block text-sm font-medium text-white mb-2"
          >
            Município <span className="text-red-400">*</span>
          </label>
          <input
            id="endereco.municipio"
            type="text"
            placeholder="Ex: São Paulo"
            disabled={isReadOnly}
            {...register("endereco.municipio")}
            className="w-full rounded-lg bg-white/95 text-gray-900 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#DB9437] placeholder:text-gray-400 disabled:opacity-60 disabled:cursor-not-allowed"
          />
          {errors.endereco?.municipio && (
            <p className="text-red-400 text-xs mt-1">
              {errors.endereco.municipio.message}
            </p>
          )}
        </div>

        <div className="md:col-span-1">
          <label
            htmlFor="endereco.uf"
            className="block text-sm font-medium text-white mb-2"
          >
            UF <span className="text-red-400">*</span>
          </label>
          <input
            id="endereco.uf"
            type="text"
            placeholder="Ex: SP"
            maxLength={2}
            disabled={isReadOnly}
            {...register("endereco.uf")}
            className="w-full rounded-lg bg-white/95 text-gray-900 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#DB9437] placeholder:text-gray-400 uppercase disabled:opacity-60 disabled:cursor-not-allowed"
          />
          {errors.endereco?.uf && (
            <p className="text-red-400 text-xs mt-1">
              {errors.endereco.uf.message}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
