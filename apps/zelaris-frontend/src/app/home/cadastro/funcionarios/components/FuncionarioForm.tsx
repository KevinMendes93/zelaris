"use client";

import { useFormContext } from "react-hook-form";
import type { FuncionarioFormData } from "@/src/schemas/funcionario.schema";
import {
  EstadoCivil,
  GrauInstrucao,
  ModoTrabalho,
  TipoSanguineo,
} from "@/src/enums";
import { maskCpf, maskTelefone, maskDate } from "@/src/lib/formatters";
import { EnderecoForm } from "@/src/app/components/form/EnderecoForm";
import { DocumentacaoForm } from "./DocumentacaoForm";
import { ContaBancariaForm } from "./ContaBancariaForm";
import { ValeTransporteForm } from "./ValeTransporteForm";
import {
  AnexoUpload,
  type PendingAnexo,
  type ExistingAnexo,
} from "./AnexoUpload";
import type { Funcao } from "@/src/models/funcao.model";
import { useEffect } from "react";

interface FuncionarioFormProps {
  funcoes: Funcao[];

  isReadOnly?: boolean;
  isSubmitting: boolean;
  temContaBancaria: boolean;
  setTemContaBancaria: (value: boolean) => void;

  pendingAnexos: PendingAnexo[];
  setPendingAnexos: (anexos: PendingAnexo[]) => void;
  existingAnexos?: ExistingAnexo[]; // Apenas para edição
  onRemoveExisting?: (id: number) => void; // Apenas para edição
  onCancel: () => void;

  submitButtonText?: string;
  showSubmitButton?: boolean;
}

export function FuncionarioForm({
  funcoes,
  isReadOnly = false,
  isSubmitting,
  temContaBancaria,
  setTemContaBancaria,
  pendingAnexos,
  setPendingAnexos,
  existingAnexos = [],
  onRemoveExisting,
  onCancel,
  submitButtonText = "Salvar",
  showSubmitButton = true,
}: FuncionarioFormProps) {
  const {
    register,
    formState: { errors },
    watch,
    setValue,
  } = useFormContext<FuncionarioFormData>();

  const isFreelancer = watch("freelancer");
  const temValeTransporte = watch("temValeTransporte");
  const cpf = watch("cpf");
  const telefone = watch("telefone");
  const recado = watch("recado");
  const dataNascimento = watch("dataNascimento");
  const dataFimContratoExperiencia = watch("dataFimContratoExperiencia");
  const dataEncerramento = watch("dataEncerramento");

  useEffect(() => {
    if (isFreelancer) {
      setValue("grauInstrucao", null);
      setValue("estadoCivil", null);
      setValue("naturalidade", null);
      setValue("nomePai", null);
      setValue("nomeMae", null);
      setValue("modoTrabalho", null);
      setValue("horarioInicio", null);
      setValue("horarioFim", null);
      setValue("dependentesIR", null);
      setValue("filhosMenores14", null);
    }
  }, [isFreelancer, setValue]);

  return (
    <>
      {/* Dados Pessoais */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-white border-b border-white/10 pb-2">
          Dados Pessoais
        </h3>
        <p className="text-sm text-white text-right mb-0">
          Os campos marcados com <span className="text-red-400">*</span> são
          obrigatórios.
        </p>

        <div>
          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="checkbox"
              {...register("freelancer")}
              disabled={isReadOnly}
              className="w-5 h-5 rounded text-[#DB9437] focus:ring-2 focus:ring-[#DB9437] disabled:opacity-60 disabled:cursor-not-allowed"
            />
            <span className="text-sm font-medium text-white">
              É Freelancer?
            </span>
          </label>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2">
            <label
              htmlFor="nome"
              className="block text-sm font-medium text-white mb-2"
            >
              Nome Completo <span className="text-red-400">*</span>
            </label>
            <input
              id="nome"
              type="text"
              placeholder="Ex: João Silva"
              {...register("nome")}
              disabled={isReadOnly}
              className="w-full rounded-lg bg-white/95 text-gray-900 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#DB9437] placeholder:text-gray-400 disabled:opacity-60 disabled:cursor-not-allowed"
            />
            {errors.nome && (
              <p className="text-red-400 text-xs mt-1">{errors.nome.message}</p>
            )}
          </div>

          <div>
            <label
              htmlFor="cpf"
              className="block text-sm font-medium text-white mb-2"
            >
              CPF <span className="text-red-400">*</span>
            </label>
            <input
              id="cpf"
              type="text"
              placeholder="000.000.000-00"
              maxLength={14}
              value={cpf || ""}
              onChange={(e) => setValue("cpf", maskCpf(e.target.value))}
              disabled={isReadOnly}
              className="w-full rounded-lg bg-white/95 text-gray-900 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#DB9437] placeholder:text-gray-400 disabled:opacity-60 disabled:cursor-not-allowed"
            />
            {errors.cpf && (
              <p className="text-red-400 text-xs mt-1">{errors.cpf.message}</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="dataNascimento"
              className="block text-sm font-medium text-white mb-2"
            >
              Data de Nascimento <span className="text-red-400">*</span>
            </label>
            <input
              id="dataNascimento"
              type="text"
              placeholder="DD/MM/AAAA"
              maxLength={10}
              value={dataNascimento || ""}
              onChange={(e) =>
                setValue("dataNascimento", maskDate(e.target.value))
              }
              disabled={isReadOnly}
              className="w-full rounded-lg bg-white/95 text-gray-900 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#DB9437] placeholder:text-gray-400 disabled:opacity-60 disabled:cursor-not-allowed"
            />
            {errors.dataNascimento && (
              <p className="text-red-400 text-xs mt-1">
                {errors.dataNascimento.message}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-white mb-2"
            >
              Email {!isFreelancer && <span className="text-red-400">*</span>}
            </label>
            <input
              id="email"
              type="email"
              placeholder="email@exemplo.com"
              {...register("email")}
              disabled={isReadOnly}
              className="w-full rounded-lg bg-white/95 text-gray-900 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#DB9437] placeholder:text-gray-400 disabled:opacity-60 disabled:cursor-not-allowed"
            />
            {errors.email && (
              <p className="text-red-400 text-xs mt-1">
                {errors.email.message}
              </p>
            )}
          </div>

          <div>
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
              maxLength={15}
              value={telefone || ""}
              onChange={(e) =>
                setValue("telefone", maskTelefone(e.target.value))
              }
              disabled={isReadOnly}
              className="w-full rounded-lg bg-white/95 text-gray-900 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#DB9437] placeholder:text-gray-400 disabled:opacity-60 disabled:cursor-not-allowed"
            />
            {errors.telefone && (
              <p className="text-red-400 text-xs mt-1">
                {errors.telefone.message}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="recado"
              className="block text-sm font-medium text-white mb-2"
            >
              Telefone Recado{" "}
              {!isFreelancer && <span className="text-red-400">*</span>}
            </label>
            <input
              id="recado"
              type="text"
              placeholder="(00) 00000-0000"
              maxLength={15}
              value={recado || ""}
              onChange={(e) => setValue("recado", maskTelefone(e.target.value))}
              disabled={isReadOnly}
              className="w-full rounded-lg bg-white/95 text-gray-900 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#DB9437] placeholder:text-gray-400 disabled:opacity-60 disabled:cursor-not-allowed"
            />
            {errors.recado && (
              <p className="text-red-400 text-xs mt-1">
                {errors.recado.message}
              </p>
            )}
          </div>
        </div>
        {!isFreelancer && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label
                  htmlFor="grauInstrucao"
                  className="block text-sm font-medium text-white mb-2"
                >
                  Grau de Instrução <span className="text-red-400">*</span>
                </label>
                <select
                  id="grauInstrucao"
                  {...register("grauInstrucao")}
                  disabled={isReadOnly}
                  className="w-full rounded-lg bg-white/95 text-gray-900 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#DB9437] disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  <option value="">Selecione...</option>
                  {Object.values(GrauInstrucao).map((grau) => (
                    <option key={grau} value={grau}>
                      {grau}
                    </option>
                  ))}
                </select>
                {errors.grauInstrucao && (
                  <p className="text-red-400 text-xs mt-1">
                    {errors.grauInstrucao.message}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="estadoCivil"
                  className="block text-sm font-medium text-white mb-2"
                >
                  Estado Civil <span className="text-red-400">*</span>
                </label>
                <select
                  id="estadoCivil"
                  {...register("estadoCivil")}
                  disabled={isReadOnly}
                  className="w-full rounded-lg bg-white/95 text-gray-900 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#DB9437] disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  <option value="">Selecione...</option>
                  {Object.values(EstadoCivil).map((estado) => (
                    <option key={estado} value={estado}>
                      {estado}
                    </option>
                  ))}
                </select>
                {errors.estadoCivil && (
                  <p className="text-red-400 text-xs mt-1">
                    {errors.estadoCivil.message}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="naturalidade"
                  className="block text-sm font-medium text-white mb-2"
                >
                  Naturalidade <span className="text-red-400">*</span>
                </label>
                <input
                  id="naturalidade"
                  type="text"
                  placeholder="Ex: São Paulo"
                  {...register("naturalidade")}
                  disabled={isReadOnly}
                  className="w-full rounded-lg bg-white/95 text-gray-900 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#DB9437] placeholder:text-gray-400 disabled:opacity-60 disabled:cursor-not-allowed"
                />
                {errors.naturalidade && (
                  <p className="text-red-400 text-xs mt-1">
                    {errors.naturalidade.message}
                  </p>
                )}
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="nomeMae"
                  className="block text-sm font-medium text-white mb-2"
                >
                  Nome da Mãe <span className="text-red-400">*</span>
                </label>
                <input
                  id="nomeMae"
                  type="text"
                  placeholder="Ex: Maria Silva"
                  {...register("nomeMae")}
                  disabled={isReadOnly}
                  className="w-full rounded-lg bg-white/95 text-gray-900 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#DB9437] placeholder:text-gray-400 disabled:opacity-60 disabled:cursor-not-allowed"
                />
                {errors.nomeMae && (
                  <p className="text-red-400 text-xs mt-1">
                    {errors.nomeMae.message}
                  </p>
                )}
              </div>
              <div>
                <label
                  htmlFor="nomePai"
                  className="block text-sm font-medium text-white mb-2"
                >
                  Nome do Pai
                </label>
                <input
                  id="nomePai"
                  type="text"
                  placeholder="Ex: José Silva"
                  {...register("nomePai")}
                  disabled={isReadOnly}
                  className="w-full rounded-lg bg-white/95 text-gray-900 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#DB9437] placeholder:text-gray-400 disabled:opacity-60 disabled:cursor-not-allowed"
                />
                {errors.nomePai && (
                  <p className="text-red-400 text-xs mt-1">
                    {errors.nomePai.message}
                  </p>
                )}
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label
                  htmlFor="dependentesIR"
                  className="block text-sm font-medium text-white mb-2"
                >
                  Dependentes IR <span className="text-red-400">*</span>
                </label>
                <input
                  id="dependentesIR"
                  type="number"
                  min="0"
                  placeholder="Ex: 2"
                  {...register("dependentesIR", { valueAsNumber: true })}
                  disabled={isReadOnly}
                  className="w-full rounded-lg bg-white/95 text-gray-900 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#DB9437] placeholder:text-gray-400 disabled:opacity-60 disabled:cursor-not-allowed"
                />
                {errors.dependentesIR && (
                  <p className="text-red-400 text-xs mt-1">
                    {errors.dependentesIR.message}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="filhosMenores14"
                  className="block text-sm font-medium text-white mb-2"
                >
                  Filhos Menores 14 anos <span className="text-red-400">*</span>
                </label>
                <input
                  id="filhosMenores14"
                  type="number"
                  min="0"
                  placeholder="Ex: 1"
                  {...register("filhosMenores14", { valueAsNumber: true })}
                  disabled={isReadOnly}
                  className="w-full rounded-lg bg-white/95 text-gray-900 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#DB9437] placeholder:text-gray-400 disabled:opacity-60 disabled:cursor-not-allowed"
                />
                {errors.filhosMenores14 && (
                  <p className="text-red-400 text-xs mt-1">
                    {errors.filhosMenores14.message}
                  </p>
                )}
              </div>
            </div>
          </>
        )}
      </div>

      {/* Endereço */}
      <EnderecoForm isReadOnly={isReadOnly} />

      {/* Documentação */}
      <DocumentacaoForm isFreelancer={isFreelancer} isReadOnly={isReadOnly} />

      {/* Dados Profissionais */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-white border-b border-white/10 pb-2">
          Dados Profissionais <span className="text-red-400">*</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
          <div className="md:col-span-2">
            <label
              htmlFor="funcaoId"
              className="block text-sm font-medium text-white mb-2"
            >
              Função <span className="text-red-400">*</span>
            </label>
            <select
              id="funcaoId"
              {...register("funcaoId", { valueAsNumber: true })}
              disabled={isReadOnly}
              className="w-full rounded-lg bg-white/95 text-gray-900 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#DB9437] disabled:opacity-60 disabled:cursor-not-allowed"
            >
              <option value="">Selecione...</option>
              {funcoes.map((funcao) => (
                <option key={funcao.id} value={funcao.id}>
                  {funcao.nome}
                </option>
              ))}
            </select>
            {errors.funcaoId && (
              <p className="text-red-400 text-xs mt-1">
                {errors.funcaoId.message}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="tipoSanguineo"
              className="block text-sm font-medium text-white mb-2"
            >
              Tipo Sanguíneo
            </label>
            <select
              id="tipoSanguineo"
              {...register("tipoSanguineo")}
              disabled={isReadOnly}
              className="w-full rounded-lg bg-white/95 text-gray-900 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#DB9437] disabled:opacity-60 disabled:cursor-not-allowed"
            >
              <option value="">Selecione...</option>
              {Object.values(TipoSanguineo).map((tipo) => (
                <option key={tipo} value={tipo}>
                  {tipo}
                </option>
              ))}
            </select>
          </div>

          <div className="md:col-span-3">
            <label
              htmlFor="pix"
              className="block text-sm font-medium text-white mb-2"
            >
              Chave PIX
            </label>
            <input
              id="pix"
              type="text"
              disabled={isReadOnly}
              placeholder="Ex: email@exemplo.com"
              {...register("pix")}
              className="w-full rounded-lg bg-white/95 text-gray-900 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#DB9437] placeholder:text-gray-400 disabled:opacity-60 disabled:cursor-not-allowed"
            />
          </div>

          {!isFreelancer && (
            <>
              <div>
                <label
                  htmlFor="modoTrabalho"
                  className="block text-sm font-medium text-white mb-2"
                >
                  Modo de Trabalho <span className="text-red-400">*</span>
                </label>
                <select
                  id="modoTrabalho"
                  {...register("modoTrabalho")}
                  disabled={isReadOnly}
                  className="w-full rounded-lg bg-white/95 text-gray-900 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#DB9437] disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  <option value="">Selecione...</option>
                  {Object.values(ModoTrabalho).map((modo) => (
                    <option key={modo} value={modo}>
                      {modo}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label
                  htmlFor="horarioInicio"
                  className="block text-sm font-medium text-white mb-2"
                >
                  Horário Início
                </label>
                <input
                  id="horarioInicio"
                  type="time"
                  {...register("horarioInicio")}
                  disabled={isReadOnly}
                  className="w-full rounded-lg bg-white/95 text-gray-900 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#DB9437] placeholder:text-gray-400 disabled:opacity-60 disabled:cursor-not-allowed"
                />
                {errors.horarioInicio && (
                  <p className="text-red-400 text-xs mt-1">
                    {errors.horarioInicio.message}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="horarioFim"
                  className="block text-sm font-medium text-white mb-2"
                >
                  Horário Fim
                </label>
                <input
                  id="horarioFim"
                  type="time"
                  {...register("horarioFim")}
                  disabled={isReadOnly}
                  className="w-full rounded-lg bg-white/95 text-gray-900 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#DB9437] placeholder:text-gray-400 disabled:opacity-60 disabled:cursor-not-allowed"
                />
                {errors.horarioFim && (
                  <p className="text-red-400 text-xs mt-1">
                    {errors.horarioFim.message}
                  </p>
                )}
              </div>

              <div className="md:col-span-2">
                <label
                  htmlFor="dataFimContratoExperiencia"
                  className="block text-sm font-medium text-white mb-2"
                >
                  Data Final do Contrato de Experiência{" "}
                  <span className="text-red-400">*</span>
                </label>
                <input
                  id="dataFimContratoExperiencia"
                  type="text"
                  placeholder="DD/MM/AAAA"
                  maxLength={10}
                  value={dataFimContratoExperiencia || ""}
                  onChange={(e) =>
                    setValue(
                      "dataFimContratoExperiencia",
                      maskDate(e.target.value)
                    )
                  }
                  disabled={isReadOnly}
                  className="w-full rounded-lg bg-white/95 text-gray-900 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#DB9437] placeholder:text-gray-400 disabled:opacity-60 disabled:cursor-not-allowed"
                />
                {errors.dataFimContratoExperiencia && (
                  <p className="text-red-400 text-xs mt-1">
                    {errors.dataFimContratoExperiencia.message}
                  </p>
                )}
              </div>
            </>
          )}

          <div>
            <label
              htmlFor="dataEncerramento"
              className="block text-sm font-medium text-white mb-2"
            >
              Data de Encerramento
            </label>
            <input
              id="dataEncerramento"
              type="text"
              placeholder="DD/MM/AAAA"
              maxLength={10}
              value={dataEncerramento || ""}
              onChange={(e) =>
                setValue("dataEncerramento", maskDate(e.target.value))
              }
              disabled={isReadOnly}
              className="w-full rounded-lg bg-white/95 text-gray-900 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#DB9437] placeholder:text-gray-400 disabled:opacity-60 disabled:cursor-not-allowed"
            />
            {errors.dataEncerramento && (
              <p className="text-red-400 text-xs mt-1">
                {errors.dataEncerramento.message}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Conta Bancária */}
      <ContaBancariaForm
        isReadOnly={isReadOnly}
        enabled={temContaBancaria}
        onToggle={setTemContaBancaria}
      />

      {/* Vale Transporte */}
      <ValeTransporteForm
        isReadOnly={isReadOnly}
        enabled={temValeTransporte}
        onToggle={(val) => setValue("temValeTransporte", val)}
      />

      {/* Anexos */}
      <AnexoUpload
        isReadOnly={isReadOnly}
        pendingAnexos={pendingAnexos}
        existingAnexos={existingAnexos}
        onAddAnexo={(anexo) => setPendingAnexos([...pendingAnexos, anexo])}
        onRemovePending={(id) =>
          setPendingAnexos(pendingAnexos.filter((a) => a.id !== id))
        }
        onRemoveExisting={onRemoveExisting}
      />

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
