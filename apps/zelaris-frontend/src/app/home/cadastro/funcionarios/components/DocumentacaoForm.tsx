"use client";

import { useFormContext } from "react-hook-form";
import type { FuncionarioFormData } from "@/src/schemas/funcionario.schema";
import { OrgaoEmissor } from "@/src/enums";
import { maskDate } from "@/src/lib/formatters";
import { useEffect } from "react";

interface DocumentacaoFormProps {
  isFreelancer: boolean;
  isReadOnly: boolean;
}

export function DocumentacaoForm({
  isFreelancer,
  isReadOnly,
}: DocumentacaoFormProps) {
  const {
    register,
    formState: { errors },
    watch,
    setValue,
  } = useFormContext<FuncionarioFormData>();

  const dataEmissao = watch("documentacao.dataEmissao");

  useEffect(() => {
    if (isFreelancer) {
      const camposParaLimpar = [
        "documentacao.ctps",
        "documentacao.serie",
        "documentacao.pis",
        "documentacao.tituloEleitor",
        "documentacao.zonaEleitoral",
      ];

      camposParaLimpar.forEach((campo) => {
        setValue(campo as keyof FuncionarioFormData, null);
      });
    }
  }, [isFreelancer, setValue]);

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-white border-b border-white/10 pb-2">
        Documentação <span className="text-red-400">*</span>
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label
            htmlFor="documentacao.identidade"
            className="block text-sm font-medium text-white mb-2"
          >
            Identidade (RG) <span className="text-red-400">*</span>
          </label>
          <input
            id="documentacao.identidade"
            type="text"
            placeholder="Ex: 123456789"
            disabled={isReadOnly}
            {...register("documentacao.identidade")}
            className="w-full rounded-lg bg-white/95 text-gray-900 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#DB9437] placeholder:text-gray-400 disabled:opacity-60 disabled:cursor-not-allowed"
          />
          {errors.documentacao?.identidade && (
            <p className="text-red-400 text-xs mt-1">
              {errors.documentacao.identidade.message}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="documentacao.orgaoEmissor"
            className="block text-sm font-medium text-white mb-2"
          >
            Órgão Emissor <span className="text-red-400">*</span>
          </label>
          <select
            id="documentacao.orgaoEmissor"
            disabled={isReadOnly}
            {...register("documentacao.orgaoEmissor")}
            className="w-full rounded-lg bg-white/95 text-gray-900 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#DB9437] disabled:opacity-60 disabled:cursor-not-allowed"
          >
            <option value="">Selecione...</option>
            {Object.values(OrgaoEmissor).map((orgao) => (
              <option key={orgao} value={orgao}>
                {orgao}
              </option>
            ))}
          </select>
          {errors.documentacao?.orgaoEmissor && (
            <p className="text-red-400 text-xs mt-1">
              {errors.documentacao.orgaoEmissor.message}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="documentacao.dataEmissao"
            className="block text-sm font-medium text-white mb-2"
          >
            Data de Emissão <span className="text-red-400">*</span>
          </label>
          <input
            id="documentacao.dataEmissao"
            type="text"
            placeholder="DD/MM/AAAA"
            maxLength={10}
            disabled={isReadOnly}
            value={dataEmissao || ""}
            onChange={(e) =>
              setValue("documentacao.dataEmissao", maskDate(e.target.value))
            }
            className="w-full rounded-lg bg-white/95 text-gray-900 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#DB9437] placeholder:text-gray-400 disabled:opacity-60 disabled:cursor-not-allowed"
          />
          {errors.documentacao?.dataEmissao && (
            <p className="text-red-400 text-xs mt-1">
              {errors.documentacao.dataEmissao.message}
            </p>
          )}
        </div>
        {!isFreelancer && (
          <>
            <div>
              <label
                htmlFor="documentacao.ctps"
                className="block text-sm font-medium text-white mb-2"
              >
                CTPS <span className="text-red-400">*</span>
              </label>
              <input
                id="documentacao.ctps"
                type="text"
                placeholder="Ex: 1234567"
                disabled={isReadOnly}
                {...register("documentacao.ctps")}
                className="w-full rounded-lg bg-white/95 text-gray-900 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#DB9437] placeholder:text-gray-400 disabled:opacity-60 disabled:cursor-not-allowed"
              />
              {errors.documentacao?.ctps && (
                <p className="text-red-400 text-xs mt-1">
                  {errors.documentacao.ctps.message}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="documentacao.serie"
                className="block text-sm font-medium text-white mb-2"
              >
                Série <span className="text-red-400">*</span>
              </label>
              <input
                id="documentacao.serie"
                type="text"
                placeholder="Ex: 001"
                disabled={isReadOnly}
                {...register("documentacao.serie")}
                className="w-full rounded-lg bg-white/95 text-gray-900 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#DB9437] placeholder:text-gray-400 disabled:opacity-60 disabled:cursor-not-allowed"
              />
              {errors.documentacao?.serie && (
                <p className="text-red-400 text-xs mt-1">
                  {errors.documentacao.serie.message}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="documentacao.pis"
                className="block text-sm font-medium text-white mb-2"
              >
                PIS <span className="text-red-400">*</span>
              </label>
              <input
                id="documentacao.pis"
                type="text"
                placeholder="Ex: 12345678901"
                disabled={isReadOnly}
                {...register("documentacao.pis")}
                className="w-full rounded-lg bg-white/95 text-gray-900 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#DB9437] placeholder:text-gray-400 disabled:opacity-60 disabled:cursor-not-allowed"
              />
              {errors.documentacao?.pis && (
                <p className="text-red-400 text-xs mt-1">
                  {errors.documentacao.pis.message}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="documentacao.tituloEleitor"
                className="block text-sm font-medium text-white mb-2"
              >
                Título de Eleitor
              </label>
              <input
                id="documentacao.tituloEleitor"
                type="text"
                placeholder="Ex: 123456789012"
                disabled={isReadOnly}
                {...register("documentacao.tituloEleitor")}
                className="w-full rounded-lg bg-white/95 text-gray-900 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#DB9437] placeholder:text-gray-400 disabled:opacity-60 disabled:cursor-not-allowed"
              />
              {errors.documentacao?.tituloEleitor && (
                <p className="text-red-400 text-xs mt-1">
                  {errors.documentacao.tituloEleitor.message}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="documentacao.zonaEleitoral"
                className="block text-sm font-medium text-white mb-2"
              >
                Zona Eleitoral
              </label>
              <input
                id="documentacao.zonaEleitoral"
                type="text"
                placeholder="Ex: 001"
                disabled={isReadOnly}
                {...register("documentacao.zonaEleitoral")}
                className="w-full rounded-lg bg-white/95 text-gray-900 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#DB9437] placeholder:text-gray-400 disabled:opacity-60 disabled:cursor-not-allowed"
              />
              {errors.documentacao?.zonaEleitoral && (
                <p className="text-red-400 text-xs mt-1">
                  {errors.documentacao.zonaEleitoral.message}
                </p>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
