"use client";

import type { Servico } from "@/src/models/servico.model";
import { StatusServico, StatusServicoLabels } from "@/src/enums";
import { formatCurrency } from "@/src/lib/formatters";
import { useEffect, useRef, useState } from "react";

interface ServicoCardProps {
  servico: Servico;
  isAdmin: boolean;
  onEdit: (servico: Servico) => void;
  onDelete: (id: number) => void;
  onAlocar: (servicoId: number) => void;
  onStatusChange: (id: number, status: StatusServico) => Promise<void>;
}

const statusConfig: Record<
  StatusServico,
  { bg: string; text: string; dot: string }
> = {
  [StatusServico.AGENDADO]: {
    bg: "bg-blue-500/20",
    text: "text-blue-300",
    dot: "bg-blue-400",
  },
  [StatusServico.EM_ANDAMENTO]: {
    bg: "bg-yellow-500/20",
    text: "text-yellow-300",
    dot: "bg-yellow-400",
  },
  [StatusServico.FINALIZADO]: {
    bg: "bg-green-500/20",
    text: "text-green-300",
    dot: "bg-green-400",
  },
  [StatusServico.CANCELADO]: {
    bg: "bg-red-500/20",
    text: "text-red-300",
    dot: "bg-red-400",
  },
};

const formatDateTime = (dateStr: string | null | undefined): string => {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

export function ServicoCard({
  servico,
  isAdmin,
  onEdit,
  onDelete,
  onAlocar,
  onStatusChange,
}: ServicoCardProps) {
  const [selectOpen, setSelectOpen] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const selectRef = useRef<HTMLDivElement>(null);

  const status = statusConfig[servico.status] ?? {
    bg: "bg-white/10",
    text: "text-white/70",
    dot: "bg-white/40",
  };

  useEffect(() => {
    if (!selectOpen) return;
    const handler = (e: MouseEvent) => {
      if (selectRef.current && !selectRef.current.contains(e.target as Node)) {
        setSelectOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [selectOpen]);

  const handleStatusSelect = async (newStatus: StatusServico) => {
    if (newStatus === servico.status) {
      setSelectOpen(false);
      return;
    }
    setIsUpdating(true);
    setSelectOpen(false);
    await onStatusChange(Number(servico.id), newStatus);
    setIsUpdating(false);
  };

  return (
    <div className="bg-linear-to-b from-[#1D3A4A] to-[#102736] rounded-xl border border-white/10 hover:border-[#DB9437]/40 transition-all shadow-lg p-5 flex flex-col gap-4">
      {/* Linha superior: descrição + badge de status */}
      <div className="flex items-start justify-between gap-4">
        <p
          className="text-white font-semibold text-base leading-snug flex-1"
          title={servico.descricao}
        >
          {servico.descricao}
        </p>
        {/* Badge clicável com dropdown */}
        <div className="relative shrink-0" ref={selectRef}>
          <button
            onClick={() => setSelectOpen((v) => !v)}
            disabled={isUpdating}
            title="Clique para alterar o status"
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border border-white/10 transition cursor-pointer hover:brightness-125 ${status.bg} ${status.text} ${isUpdating ? "opacity-50 cursor-not-allowed" : ""}`}
          >
            <span className={`w-1.5 h-1.5 rounded-full ${status.dot}`} />
            {isUpdating ? "Salvando..." : StatusServicoLabels[servico.status]}
          </button>

          {selectOpen && (
            <div className="absolute right-0 top-full mt-1 z-50 w-40 rounded-xl border border-white/10 bg-[#1D3A4A] shadow-xl overflow-hidden">
              {Object.values(StatusServico).map((s) => {
                const cfg = statusConfig[s];
                return (
                  <button
                    key={s}
                    disabled={!isAdmin}
                    onClick={() => handleStatusSelect(s)}
                    className={`w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold transition hover:brightness-125 disabled:cursor-not-allowed ${
                      s === servico.status
                        ? `${cfg.bg} ${cfg.text}`
                        : "text-white/70 hover:bg-white/5"
                    }`}
                  >
                    <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
                    {StatusServicoLabels[s]}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Separador */}
      <div className="border-t border-white/10" />

      {/* Metadados em grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-x-6 gap-y-3 text-sm">
        {/* Cliente */}
        <div className="col-span-2 sm:col-span-1">
          <p className="text-white/40 text-xs mb-0.5">Cliente</p>
          <p className="text-white/90 truncate" title={servico.cliente?.nome}>
            {servico.cliente?.nome || "—"}
          </p>
        </div>

        {/* Início */}
        <div>
          <p className="text-white/40 text-xs mb-0.5">Início</p>
          <p className="text-white/90">
            {formatDateTime(servico.data_hora_inicio)}
          </p>
        </div>

        {/* Fim */}
        <div>
          <p className="text-white/40 text-xs mb-0.5">Fim</p>
          <p className="text-white/90">
            {formatDateTime(servico.data_hora_fim)}
          </p>
        </div>

        {/* Valor */}
        <div>
          <p className="text-white/40 text-xs mb-0.5">Valor</p>
          <p className="text-white font-semibold">
            {formatCurrency(servico.valor)}
          </p>
        </div>
      </div>

      {/* Ações */}
      <div className="flex gap-2 pt-1 border-t border-white/10">
        {isAdmin && (
          <button
            onClick={() => onAlocar(Number(servico.id))}
            className="flex-1 py-2 rounded-lg text-xs font-semibold text-emerald-400 hover:bg-emerald-500/10 border border-emerald-400/30 hover:border-emerald-400/60 transition"
          >
            Alocar Funcionário
          </button>
        )}
        <button
          onClick={() => onEdit(servico)}
          className="flex-1 py-2 rounded-lg text-xs font-semibold text-[#DB9437] hover:bg-[#DB9437]/10 border border-[#DB9437]/30 hover:border-[#DB9437]/60 transition"
        >
          {isAdmin ? "Editar" : "Ver"}
        </button>
        {isAdmin && (
          <button
            onClick={() => onDelete(Number(servico.id))}
            className="flex-1 py-2 rounded-lg text-xs font-semibold text-red-400 hover:bg-red-500/10 border border-red-400/30 hover:border-red-400/60 transition"
          >
            Excluir
          </button>
        )}
      </div>
    </div>
  );
}
