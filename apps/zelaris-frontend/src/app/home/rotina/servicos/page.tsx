"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter } from "next/navigation";
import { AuthGuard } from "@/src/app/auth/components/AuthGuard";
import { SidebarShell } from "@/src/app/components/layout/SidebarShell";
import { PageHeader } from "@/src/app/components/list/PageHeader";
import { Pagination } from "@/src/app/components/list/Pagination";
import { usePaginatedList } from "@/src/hooks/usePaginatedList";
import { servicoService } from "@/src/services/servico.service";
import { clienteService } from "@/src/services/cliente.service";
import type { Servico } from "@/src/models/servico.model";
import type { Cliente } from "@/src/models/cliente.model";
import { useToast } from "@/src/app/components/ui/ToastProvider";
import { useAuth } from "@/src/app/auth/hooks/useAuth";
import { Role } from "@/src/models/user.model";
import { maskDate, isValidDate } from "@/src/lib/formatters";
import { ServicoCard } from "./components/ServicoCard";
import { AlocacaoModal } from "../alocacoes/components/AlocacaoModal";
import { StatusServico } from "@/src/enums";

type SortField =
  | "descricao"
  | "data_hora_inicio"
  | "data_hora_fim"
  | "valor"
  | "clienteNome"
  | "createdAt";

function ServicosContent() {
  const router = useRouter();
  const { showToast } = useToast();
  const { user } = useAuth();

  const isAdmin = user?.roles.includes(Role.ADMIN) ?? false;

  const [clientes, setClientes] = useState<Cliente[]>([]);

  const [showFilters, setShowFilters] = useState(false);
  const [status, setStatus] = useState("");
  const [clienteId, setClienteId] = useState("");
  const [dataHoraInicio, setDataHoraInicio] = useState("");
  const [dataHoraFim, setDataHoraFim] = useState("");

  const [alocacaoModalOpen, setAlocacaoModalOpen] = useState(false);
  const [selectedServicoId, setSelectedServicoId] = useState<
    number | undefined
  >();

  const list = usePaginatedList<Servico>({
    fetchFn: servicoService.list,
    basePath: "/home/rotina/servicos",
    defaultSort: { field: "createdAt", order: "DESC" },
    filters: {
      status: status || undefined,
      clienteId: clienteId ? parseInt(clienteId) : undefined,
      dataHoraInicio:
        dataHoraInicio.length === 10 && isValidDate(dataHoraInicio)
          ? dataHoraInicio
          : undefined,
      dataHoraFim:
        dataHoraFim.length === 10 && isValidDate(dataHoraFim)
          ? dataHoraFim
          : undefined,
    },
    errorMessage: "Erro ao carregar serviços",
  });

  const hasActiveFilters =
    list.search || status || clienteId || dataHoraInicio || dataHoraFim;

  useEffect(() => {
    clienteService
      .list({ limit: 1000, sortBy: "nome", sortOrder: "ASC", ativo: true })
      .then((res) => {
        if (res.success && res.data) setClientes(res.data.items);
      })
      .catch(() => {});
  }, []);

  const handleStatusChange = async (id: number, newStatus: StatusServico) => {
    try {
      const response = await servicoService.changeStatus(id, newStatus);
      if (response.success) {
        showToast({
          type: "success",
          message: "Status atualizado com sucesso",
        });
        list.refetch();
      } else {
        showToast({
          type: "error",
          message: response.message || "Erro ao atualizar status",
        });
      }
    } catch {
      showToast({ type: "error", message: "Erro ao atualizar status" });
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Tem certeza que deseja excluir este serviço?")) return;
    try {
      const response = await servicoService.remove(id);
      if (response.success) {
        showToast({ type: "success", message: "Serviço excluído com sucesso" });
        list.refetch();
      } else {
        showToast({
          type: "error",
          message: response.message || "Erro ao excluir serviço",
        });
      }
    } catch {
      showToast({ type: "error", message: "Erro ao excluir serviço" });
    }
  };

  const handleAlocar = (servicoId: number) => {
    setSelectedServicoId(servicoId);
    setAlocacaoModalOpen(true);
  };

  const clearFilters = () => {
    list.setSearch("");
    setStatus("");
    setClienteId("");
    setDataHoraInicio("");
    setDataHoraFim("");
    setShowFilters(false);
  };

  return (
    <AuthGuard>
      <SidebarShell>
        <div className="w-full max-w-5xl mx-auto p-6 space-y-6">
          <PageHeader
            title="Serviços"
            subtitle="Gerencie os serviços e alocações de funcionários"
            onAdd={() => router.push("/home/rotina/servicos/nova")}
            addLabel="+ Novo Serviço"
            showAdd={isAdmin}
          />

          {/* Barra de controles */}
          <div className="bg-linear-to-b from-[#1D3A4A] to-[#102736] rounded-lg p-5 space-y-4">
            <div className="flex flex-wrap gap-3 items-center justify-between">
              <div className="flex-1 min-w-[200px]">
                <input
                  type="text"
                  placeholder="Buscar por descrição..."
                  value={list.search}
                  onChange={(e) => list.setSearch(e.target.value)}
                  className="w-full rounded-lg bg-white/95 text-gray-900 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#DB9437]"
                />
              </div>

              <div className="flex gap-2 items-center flex-wrap">
                <p className="text-sm text-white/50 mr-1">
                  {list.loading
                    ? "Carregando..."
                    : `${list.meta.total} serviço(s)`}
                </p>

                <select
                  value={list.sortBy}
                  onChange={(e) => list.setSortBy(e.target.value as SortField)}
                  className="rounded-lg bg-white/10 text-white text-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#DB9437] border border-white/10 [&>option]:bg-white [&>option]:text-gray-900"
                >
                  <option value="createdAt">Ordenar: Cadastro</option>
                  <option value="descricao">Ordenar: Descrição</option>
                  <option value="data_hora_inicio">Ordenar: Data início</option>
                  <option value="data_hora_fim">Ordenar: Data fim</option>
                  <option value="valor">Ordenar: Valor</option>
                  <option value="clienteNome">Ordenar: Cliente</option>
                </select>

                <button
                  onClick={list.toggleSortOrder}
                  className="px-3 py-2 rounded-lg bg-white/10 text-white text-sm hover:bg-white/20 transition border border-white/10"
                >
                  {list.sortOrder === "ASC" ? "↑ Crescente" : "↓ Decrescente"}
                </button>

                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className={`px-5 py-2 rounded-lg font-semibold text-sm transition ${
                    showFilters || hasActiveFilters
                      ? "bg-[#DB9437] text-white hover:bg-[#c7812e]"
                      : "bg-white/10 text-white hover:bg-white/20 border border-white/10"
                  }`}
                >
                  {hasActiveFilters ? "🔍 Filtros ativos" : "🔍 Filtros"}
                </button>
              </div>
            </div>

            {/* Filtros avançados */}
            {showFilters && (
              <div className="pt-4 border-t border-white/10 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-white/60 mb-1">
                      Status
                    </label>
                    <select
                      value={status}
                      onChange={(e) => setStatus(e.target.value)}
                      className="w-full rounded-lg bg-white/95 text-gray-900 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#DB9437]"
                    >
                      <option value="">Todos</option>
                      <option value="AGENDADO">Agendado</option>
                      <option value="EM_ANDAMENTO">Em Andamento</option>
                      <option value="FINALIZADO">Finalizado</option>
                      <option value="CANCELADO">Cancelado</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-white/60 mb-1">
                      Cliente
                    </label>
                    <select
                      value={clienteId}
                      onChange={(e) => setClienteId(e.target.value)}
                      className="w-full rounded-lg bg-white/95 text-gray-900 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#DB9437]"
                    >
                      <option value="">Todos</option>
                      {clientes.map((cliente) => (
                        <option key={cliente.id} value={cliente.id}>
                          {cliente.nome}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-white/60 mb-1">
                      Data Início (De)
                    </label>
                    <input
                      type="text"
                      placeholder="DD/MM/YYYY"
                      value={dataHoraInicio}
                      onChange={(e) =>
                        setDataHoraInicio(maskDate(e.target.value))
                      }
                      maxLength={10}
                      className="w-full rounded-lg bg-white/95 text-gray-900 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#DB9437]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-white/60 mb-1">
                      Data Fim (Até)
                    </label>
                    <input
                      type="text"
                      placeholder="DD/MM/YYYY"
                      value={dataHoraFim}
                      onChange={(e) => setDataHoraFim(maskDate(e.target.value))}
                      maxLength={10}
                      className="w-full rounded-lg bg-white/95 text-gray-900 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#DB9437]"
                    />
                  </div>
                </div>
                <div className="flex justify-end">
                  <button
                    onClick={clearFilters}
                    className="text-white/50 hover:text-white text-sm transition"
                  >
                    Limpar filtros
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Paginação (topo) */}
          <Pagination
            meta={list.meta}
            onPageChange={list.handlePageChange}
            label="serviço(s)"
          />

          {/* Lista de cards */}
          {list.loading ? (
            <div className="space-y-4">
              {Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className="bg-linear-to-b from-[#1D3A4A] to-[#102736] rounded-xl p-5 border border-white/10 animate-pulse"
                >
                  <div className="flex justify-between mb-4">
                    <div className="h-4 bg-white/10 rounded w-2/3" />
                    <div className="h-4 bg-white/10 rounded w-20" />
                  </div>
                  <div className="h-px bg-white/10 mb-4" />
                  <div className="grid grid-cols-4 gap-4">
                    <div className="h-3 bg-white/10 rounded" />
                    <div className="h-3 bg-white/10 rounded" />
                    <div className="h-3 bg-white/10 rounded" />
                    <div className="h-3 bg-white/10 rounded" />
                  </div>
                </div>
              ))}
            </div>
          ) : list.items.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <span className="text-5xl mb-4">📋</span>
              <p className="text-white/60 text-lg font-medium mb-2">
                Nenhum serviço encontrado
              </p>
              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="mt-2 text-[#DB9437] hover:text-[#c7812e] text-sm transition"
                >
                  Limpar filtros
                </button>
              )}
            </div>
          ) : (
            <>
              <div className="space-y-4">
                {list.items.map((servico) => (
                  <ServicoCard
                    key={servico.id}
                    servico={servico}
                    isAdmin={isAdmin}
                    onEdit={(servico) =>
                      router.push(`/home/rotina/servicos/${servico.id}`)
                    }
                    onDelete={handleDelete}
                    onAlocar={handleAlocar}
                    onStatusChange={handleStatusChange}
                  />
                ))}
              </div>

              {/* Paginação (rodapé) */}
              <Pagination
                meta={list.meta}
                onPageChange={list.handlePageChange}
                label="serviço(s)"
              />
            </>
          )}
        </div>

        {/* Modal de alocação */}
        <AlocacaoModal
          isOpen={alocacaoModalOpen}
          onClose={() => {
            setAlocacaoModalOpen(false);
            setSelectedServicoId(undefined);
          }}
          onSuccess={() => {}}
          preSelectedServicoId={selectedServicoId}
        />
      </SidebarShell>
    </AuthGuard>
  );
}

export default function ServicosPage() {
  return (
    <Suspense fallback={null}>
      <ServicosContent />
    </Suspense>
  );
}
