"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  alocacaoSchema,
  type AlocacaoFormData,
} from "@/src/schemas/alocacao.schema";
import { alocacaoService } from "@/src/services/alocacao.service";
import { servicoService } from "@/src/services/servico.service";
import { funcionarioService } from "@/src/services/funcionario.service";
import { useToast } from "@/src/app/components/ui/ToastProvider";
import type { Servico } from "@/src/models/servico.model";
import type { Funcionario } from "@/src/models/funcionario.model";
import type { Alocacao } from "@/src/models/alocacao.model";
import { StatusServico } from "@/src/enums/status-servico.enum";
import {
  isoToLocalDate,
  isoToLocalTime,
  formatDateTime,
} from "@/src/lib/formatters";

interface AlocacaoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  preSelectedServicoId?: number;
  editingAlocacao?: Alocacao | null;
}

export function AlocacaoModal({
  isOpen,
  onClose,
  onSuccess,
  preSelectedServicoId,
  editingAlocacao,
}: AlocacaoModalProps) {
  const { showToast } = useToast();
  const [servicos, setServicos] = useState<Servico[]>([]);
  const [funcionarios, setFuncionarios] = useState<Funcionario[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const [loadingFuncionarios, setLoadingFuncionarios] = useState(false);

  const isEditing = !!editingAlocacao;

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<AlocacaoFormData>({
    resolver: zodResolver(alocacaoSchema),
    defaultValues: { ft: false },
  });

  const selectedServicoId = watch("servicoId");
  const selectedServico =
    servicos.find(
      (servico) => Number(servico.id) === Number(selectedServicoId)
    ) ?? null;

  const dataInicio = watch("data_inicio");
  const horaInicio = watch("hora_inicio");
  const dataFim = watch("data_fim");
  const horaFim = watch("hora_fim");
  const isFt = watch("ft");
  const hasPeriodoCompleto = !!(dataInicio && horaInicio && dataFim && horaFim);

  useEffect(() => {
    if (!isOpen) return;

    const loadData = async () => {
      setLoadingData(true);
      try {
        const servicosRes = await servicoService.list({
          limit: 1000,
          sortBy: "descricao",
          sortOrder: "ASC",
          status: [StatusServico.AGENDADO, StatusServico.EM_ANDAMENTO].join(
            ","
          ),
        });

        if (servicosRes.success && servicosRes.data) {
          setServicos(servicosRes.data.items);
        }
      } catch {
        showToast({ type: "error", message: "Erro ao carregar dados" });
      } finally {
        setLoadingData(false);
      }
    };

    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    if (editingAlocacao) {
      reset({
        servicoId: editingAlocacao.servico?.id,
        funcionarioId: editingAlocacao.funcionario?.id,
        data_inicio: isoToLocalDate(editingAlocacao.data_hora_inicio),
        hora_inicio: isoToLocalTime(editingAlocacao.data_hora_inicio),
        data_fim: isoToLocalDate(editingAlocacao.data_hora_fim),
        hora_fim: isoToLocalTime(editingAlocacao.data_hora_fim),
        ft: editingAlocacao.ft,
      });
    } else {
      reset({
        ft: false,
        servicoId: preSelectedServicoId ?? undefined,
        funcionarioId: undefined,
        data_inicio: "",
        hora_inicio: "",
        data_fim: "",
        hora_fim: "",
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, editingAlocacao, preSelectedServicoId]);

  useEffect(() => {
    if (!isEditing || !editingAlocacao?.funcionario?.id) return;
    if (funcionarios.length === 0) return;

    const funcId = editingAlocacao.funcionario.id;
    const exists = funcionarios.some((f) => Number(f.id) === Number(funcId));
    if (exists) {
      setValue("funcionarioId", funcId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [funcionarios]);

  useEffect(() => {
    if (!isOpen || !hasPeriodoCompleto) return;

    const fetchFuncionariosDisponiveis = async () => {
      setLoadingFuncionarios(true);
      try {
        const inicio = `${dataInicio}T${horaInicio}:00`;
        const fim = `${dataFim}T${horaFim}:00`;
        const res = await funcionarioService.findToAlocacao(
          inicio,
          fim,
          isFt,
          editingAlocacao?.id
        );
        if (res.success && res.data) {
          setFuncionarios(res.data);
        }
      } catch {
        showToast({
          type: "error",
          message: "Erro ao buscar funcionários disponíveis",
        });
      } finally {
        setLoadingFuncionarios(false);
      }
    };

    fetchFuncionariosDisponiveis();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, dataInicio, horaInicio, dataFim, horaFim, isFt]);

  const onSubmit = async (data: AlocacaoFormData) => {
    setSubmitting(true);
    try {
      const payload = {
        servicoId: data.servicoId,
        funcionarioId: data.funcionarioId,
        ft: data.ft,
        data_hora_inicio: `${data.data_inicio}T${data.hora_inicio}:00`,
        data_hora_fim: `${data.data_fim}T${data.hora_fim}:00`,
      };

      const response = isEditing
        ? await alocacaoService.update(editingAlocacao!.id, payload)
        : await alocacaoService.create(payload);

      if (response.success) {
        showToast({
          type: "success",
          message: isEditing
            ? "Alocação atualizada com sucesso!"
            : "Alocação criada com sucesso!",
        });
        onSuccess();
        onClose();
      } else {
        showToast({
          type: "error",
          message: response.message || "Erro ao salvar alocação",
        });
      }
    } catch {
      showToast({ type: "error", message: "Erro ao salvar alocação" });
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen) return null;

  const inputClass =
    "w-full rounded-lg bg-white/95 text-gray-900 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#DB9437] disabled:bg-gray-300 disabled:cursor-not-allowed";
  const labelClass = "block text-sm font-medium text-white/90 mb-1";
  const errorClass = "text-red-400 text-xs mt-1";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-[#1D3A4A] rounded-xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto border border-white/10">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-white/10">
          <h2 className="text-xl font-bold text-white">
            {isEditing ? "Editar Alocação" : "Nova Alocação"}
          </h2>
          <button
            onClick={onClose}
            className="text-white/50 hover:text-white text-3xl leading-none transition"
          >
            &times;
          </button>
        </div>

        {/* Body */}
        {loadingData ? (
          <div className="p-8 text-center text-white/60">
            <div className="animate-pulse">Carregando dados...</div>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-5">
            {/* Serviço */}
            <div>
              <label className={labelClass}>Serviço *</label>
              <select
                {...register("servicoId", { valueAsNumber: true })}
                disabled={!!preSelectedServicoId && !isEditing}
                className={inputClass}
              >
                <option value="">Selecione um serviço</option>
                {servicos.map((servico) => (
                  <option key={servico.id} value={servico.id}>
                    {servico.descricao.length > 55
                      ? servico.descricao.substring(0, 55) + "…"
                      : servico.descricao}{" "}
                    — {servico.cliente?.nome}
                  </option>
                ))}
              </select>
              {errors.servicoId && (
                <p className={errorClass}>{errors.servicoId.message}</p>
              )}
              {selectedServico && (
                <p className="mt-2 text-xs text-white/50 bg-white/5 rounded-lg px-3 py-2 leading-relaxed">
                  📅 Este serviço se inicia em{" "}
                  <span className="text-white/80 font-medium">
                    {formatDateTime(selectedServico.data_hora_inicio)}
                  </span>
                  {selectedServico.data_hora_fim ? (
                    <>
                      {" "}
                      e termina em{" "}
                      <span className="text-white/80 font-medium">
                        {formatDateTime(selectedServico.data_hora_fim)}
                      </span>
                    </>
                  ) : (
                    " e não possui data de término definida"
                  )}
                  .
                </p>
              )}
            </div>

            {/* Período */}
            <div className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Data de Início *</label>
                  <input
                    type="date"
                    {...register("data_inicio")}
                    className={inputClass}
                  />
                  {errors.data_inicio && (
                    <p className={errorClass}>{errors.data_inicio.message}</p>
                  )}
                </div>
                <div>
                  <label className={labelClass}>Hora de Início *</label>
                  <input
                    type="time"
                    {...register("hora_inicio")}
                    className={inputClass}
                  />
                  {errors.hora_inicio && (
                    <p className={errorClass}>{errors.hora_inicio.message}</p>
                  )}
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Data de Fim *</label>
                  <input
                    type="date"
                    {...register("data_fim")}
                    className={inputClass}
                  />
                  {errors.data_fim && (
                    <p className={errorClass}>{errors.data_fim.message}</p>
                  )}
                </div>
                <div>
                  <label className={labelClass}>Hora de Fim *</label>
                  <input
                    type="time"
                    {...register("hora_fim")}
                    className={inputClass}
                  />
                  {errors.hora_fim && (
                    <p className={errorClass}>{errors.hora_fim.message}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Funcionário */}
            <div>
              <label className={labelClass}>Funcionário *</label>
              <select
                {...register("funcionarioId", { valueAsNumber: true })}
                disabled={!hasPeriodoCompleto || loadingFuncionarios}
                className={inputClass}
              >
                <option value="">
                  {!hasPeriodoCompleto
                    ? "Preencha o período primeiro"
                    : loadingFuncionarios
                      ? "Buscando disponíveis..."
                      : "Selecione um funcionário"}
                </option>
                {funcionarios.map((funcionario) => (
                  <option key={funcionario.id} value={funcionario.id}>
                    {funcionario.nome}
                    {funcionario.freelancer ? " (Freelancer)" : ""}
                  </option>
                ))}
              </select>
              {errors.funcionarioId && (
                <p className={errorClass}>{errors.funcionarioId.message}</p>
              )}
            </div>

            {/* FT */}
            <div className="flex items-center gap-3 py-1">
              <input
                type="checkbox"
                id="modal-ft"
                {...register("ft")}
                className="w-5 h-5 rounded border-gray-300 text-[#DB9437] focus:ring-2 focus:ring-[#DB9437] cursor-pointer"
              />
              <label
                htmlFor="modal-ft"
                className="text-sm text-white/90 cursor-pointer select-none"
              >
                Hora Extra (FT)
              </label>
            </div>

            {/* Botões */}
            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-3 rounded-lg border border-white/20 text-white/80 hover:bg-white/10 transition text-sm font-medium"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="flex-1 py-3 rounded-lg bg-[#DB9437] hover:bg-[#c7812e] text-white font-semibold transition text-sm disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {submitting
                  ? "Salvando..."
                  : isEditing
                    ? "Salvar alterações"
                    : "Alocar funcionário"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
