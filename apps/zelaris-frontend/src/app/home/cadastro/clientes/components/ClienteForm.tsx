"use client";

import { useFormContext } from "react-hook-form";
import type { ClienteFormData } from "@/src/schemas/cliente.schema";
import { maskCpf, maskCnpj, maskTelefone } from "@/src/lib/formatters";
import { EnderecoForm } from "@/src/app/components/form/EnderecoForm";

interface ClienteFormProps {
  isReadOnly?: boolean;
  isSubmitting: boolean;
  onCancel: () => void;
  submitButtonText?: string;
  showSubmitButton?: boolean;
}

export function ClienteForm({
  isReadOnly = false,
  isSubmitting,
  onCancel,
  submitButtonText = "Salvar",
  showSubmitButton = true,
}: ClienteFormProps) {
  const {
    register,
    formState: { errors },
    watch,
    setValue,
  } = useFormContext<ClienteFormData>();

  const pessoaJuridica = watch("pessoaJuridica");
  const documento = watch("documento");
  const telefone = watch("telefone");

  const handlePessoaJuridicaChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const newValue = e.target.checked;
    if (documento) {
      setValue("documento", "");
    }
    setValue("pessoaJuridica", newValue);
  };

  const handleDocumentoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const maskedValue = pessoaJuridica ? maskCnpj(value) : maskCpf(value);
    setValue("documento", maskedValue);
  };

  const handleTelefoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const maskedValue = maskTelefone(e.target.value);
    setValue("telefone", maskedValue);
  };

  return (
    <>
      {/* Dados Básicos */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-white border-b border-white/10 pb-2">
          Dados do Cliente
        </h3>

        {/* Tipo de Pessoa */}
        <div className="md:col-span-2">
          <label className="flex items-center space-x-3 cursor-pointer">
            <input
              type="checkbox"
              disabled={isReadOnly}
              checked={pessoaJuridica}
              onChange={handlePessoaJuridicaChange}
              className="w-5 h-5 rounded border-gray-300 text-[#DB9437] focus:ring-2 focus:ring-[#DB9437] disabled:cursor-not-allowed"
            />
            <span className="text-sm font-medium text-white">
              Pessoa Jurídica (CNPJ)
            </span>
          </label>
          <p className="text-xs text-gray-400 mt-1">
            {pessoaJuridica
              ? "Documento será validado como CNPJ (14 dígitos)"
              : "Documento será validado como CPF (11 dígitos)"}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Nome */}
          <div className="md:col-span-3">
            <label
              htmlFor="nome"
              className="block text-sm font-medium text-white mb-2"
            >
              Nome <span className="text-red-400">*</span>
            </label>
            <input
              id="nome"
              type="text"
              placeholder="Nome completo ou razão social"
              disabled={isReadOnly}
              maxLength={100}
              {...register("nome")}
              className="w-full rounded-lg bg-white/95 text-gray-900 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#DB9437] placeholder:text-gray-400 disabled:opacity-60 disabled:cursor-not-allowed"
            />
            {errors.nome && (
              <p className="text-red-400 text-xs mt-1">{errors.nome.message}</p>
            )}
          </div>

          {/* Documento (CPF ou CNPJ) */}
          <div>
            <label
              htmlFor="documento"
              className="block text-sm font-medium text-white mb-2"
            >
              {pessoaJuridica ? "CNPJ" : "CPF"}{" "}
              <span className="text-red-400">*</span>
            </label>
            <input
              id="documento"
              type="text"
              placeholder={
                pessoaJuridica ? "00.000.000/0000-00" : "000.000.000-00"
              }
              disabled={isReadOnly}
              value={documento || ""}
              onChange={handleDocumentoChange}
              maxLength={pessoaJuridica ? 18 : 14}
              className="w-full rounded-lg bg-white/95 text-gray-900 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#DB9437] placeholder:text-gray-400 disabled:opacity-60 disabled:cursor-not-allowed"
            />
            {errors.documento && (
              <p className="text-red-400 text-xs mt-1">
                {errors.documento.message}
              </p>
            )}
          </div>

          {/* E-mail */}
          <div className="md:col-span-2">
            <label
              htmlFor="email"
              className="block text-sm font-medium text-white mb-2"
            >
              E-mail <span className="text-red-400">*</span>
            </label>
            <input
              id="email"
              type="email"
              placeholder="cliente@exemplo.com"
              disabled={isReadOnly}
              {...register("email")}
              className="w-full rounded-lg bg-white/95 text-gray-900 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#DB9437] placeholder:text-gray-400 disabled:opacity-60 disabled:cursor-not-allowed"
            />
            {errors.email && (
              <p className="text-red-400 text-xs mt-1">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Telefone */}
          <div className="md:col-span-2">
            <label
              htmlFor="telefone"
              className="block text-sm font-medium text-white mb-2"
            >
              Telefone <span className="text-red-400">*</span>
            </label>
            <input
              id="telefone"
              type="text"
              placeholder="(00) 00000-0000"
              disabled={isReadOnly}
              value={telefone || ""}
              onChange={handleTelefoneChange}
              maxLength={15}
              className="w-full rounded-lg bg-white/95 text-gray-900 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#DB9437] placeholder:text-gray-400 disabled:opacity-60 disabled:cursor-not-allowed"
            />
            {errors.telefone && (
              <p className="text-red-400 text-xs mt-1">
                {errors.telefone.message}
              </p>
            )}
          </div>

          {/* Ativo */}
          <div>
            <label className="flex items-center space-x-3 cursor-pointer">
              <input
                type="checkbox"
                disabled={isReadOnly}
                {...register("ativo")}
                className="w-5 h-5 rounded border-gray-300 text-[#DB9437] focus:ring-2 focus:ring-[#DB9437] disabled:cursor-not-allowed"
              />
              <span className="text-sm font-medium text-white">
                Cliente Ativo
              </span>
            </label>
          </div>
        </div>
      </div>

      {/* Endereço */}
      <EnderecoForm isReadOnly={isReadOnly} />

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
