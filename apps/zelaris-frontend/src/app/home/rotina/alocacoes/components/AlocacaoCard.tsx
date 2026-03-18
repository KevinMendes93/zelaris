"use client";

import type { Alocacao } from "@/src/models/alocacao.model";

interface AlocacaoCardProps {
  alocacao: Alocacao;
  isAdmin: boolean;
  onEdit: (alocacao: Alocacao) => void;
  onDelete: (id: number) => void;
  loadingEdit: boolean;
}

export function AlocacaoCard({
  alocacao,
  isAdmin,
  onEdit,
  onDelete,
}: AlocacaoCardProps) {
  const formatDateTime = (dateStr: string) => {
    if (!dateStr) return "—";
    return new Date(dateStr).toLocaleString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatHoras = (horas: number) => {
    if (!horas && horas !== 0) return "—";
    const h = Math.floor(horas);
    const min = Math.round((horas - h) * 60);
    if (min === 0) return `${h}h`;
    return `${h}h ${String(min).padStart(2, "0")}min`;
  };

  return (
    <div className="bg-linear-to-b from-[#1D3A4A] to-[#102736] rounded-xl p-5 border border-white/10 hover:border-[#DB9437]/40 transition-all flex flex-col gap-3 shadow-lg">
      {/* Cabeçalho: Serviço + badge FT */}
      <div className="flex justify-between items-start gap-2">
        <div className="flex-1 min-w-0">
          <p className="text-xs text-white/40 font-medium uppercase tracking-wider mb-1">
            Serviço
          </p>
          <p
            className="text-white font-semibold text-sm leading-snug"
            title={alocacao.servico?.descricao}
          >
            {alocacao.servico?.descricao
              ? alocacao.servico.descricao.length > 60
                ? alocacao.servico.descricao.substring(0, 60) + "…"
                : alocacao.servico.descricao
              : "—"}
          </p>
        </div>
        {alocacao.ft && (
          <span className="shrink-0 px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-xs font-bold border border-amber-500/30 mt-1">
            FT
          </span>
        )}
      </div>

      {/* Divisor */}
      <div className="border-t border-white/10" />

      {/* Cliente */}
      <div className="flex items-center gap-2">
        <span className="text-base shrink-0">🏢</span>
        <div className="min-w-0">
          <p className="text-xs text-white/40 leading-none mb-0.5">Cliente</p>
          <p className="text-sm text-white/80 truncate">
            {alocacao.servico?.cliente?.nome || "—"}
          </p>
        </div>
      </div>

      {/* Funcionário */}
      <div className="flex items-center gap-2">
        <span className="text-base shrink-0">👷</span>
        <div className="min-w-0">
          <p className="text-xs text-white/40 leading-none mb-0.5">
            Funcionário
          </p>
          <p className="text-sm text-white/80 truncate">
            {alocacao.funcionario?.nome || "—"}
            {alocacao.funcionario?.freelancer && (
              <span className="ml-1 text-white/40 text-xs">(Freelancer)</span>
            )}
          </p>
        </div>
      </div>

      {/* Divisor */}
      <div className="border-t border-white/10" />

      {/* Período */}
      <div className="grid grid-cols-2 gap-3 text-xs">
        <div>
          <p className="text-white/40 mb-0.5">Início</p>
          <p className="text-white/90 font-medium">
            {formatDateTime(alocacao.data_hora_inicio)}
          </p>
        </div>
        <div>
          <p className="text-white/40 mb-0.5">Fim</p>
          <p className="text-white/90 font-medium">
            {formatDateTime(alocacao.data_hora_fim)}
          </p>
        </div>
      </div>

      {/* Horas alocadas */}
      <div className="flex items-center justify-between bg-white/5 rounded-lg px-3 py-2">
        <div className="flex items-center gap-2">
          <span className="text-sm">⏱️</span>
          <span className="text-sm text-white/80">
            {formatHoras(alocacao.horas_alocadas)} alocadas
          </span>
        </div>
        {alocacao.ft && alocacao.horas_ft > 0 && (
          <span className="text-amber-300 text-xs font-medium">
            {formatHoras(alocacao.horas_ft)} FT
          </span>
        )}
      </div>

      {/* Ações (somente admin) */}
      {isAdmin && (
        <div className="flex gap-2 pt-1">
          <button
            onClick={() => onEdit(alocacao)}
            className="flex-1 py-2 rounded-lg text-xs font-semibold text-[#DB9437] hover:bg-[#DB9437]/10 border border-[#DB9437]/30 hover:border-[#DB9437]/60 transition"
          >
            Editar
          </button>
          <button
            onClick={() => onDelete(alocacao.id)}
            className="flex-1 py-2 rounded-lg text-xs font-semibold text-red-400 hover:bg-red-500/10 border border-red-400/30 hover:border-red-400/60 transition"
          >
            Excluir
          </button>
        </div>
      )}
    </div>
  );
}
