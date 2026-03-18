"use client";

import { useEffect, useState, Suspense } from "react";
import { AuthGuard } from "@/src/app/auth/components/AuthGuard";
import { SidebarShell } from "@/src/app/components/layout/SidebarShell";
import { PageHeader } from "@/src/app/components/list/PageHeader";
import { Pagination } from "@/src/app/components/list/Pagination";
import { usePaginatedList } from "@/src/hooks/usePaginatedList";
import { useToast } from "@/src/app/components/ui/ToastProvider";
import { useAuth } from "@/src/app/auth/hooks/useAuth";
import { Role } from "@/src/models/user.model";
import { alocacaoService } from "@/src/services/alocacao.service";
import { clienteService } from "@/src/services/cliente.service";
import { funcionarioService } from "@/src/services/funcionario.service";
import { AlocacaoCard } from "./components/AlocacaoCard";
import { AlocacaoModal } from "./components/AlocacaoModal";
import { maskDate, isValidDate } from "@/src/lib/formatters";
import type { Alocacao } from "@/src/models/alocacao.model";
import type { Cliente } from "@/src/models/cliente.model";
import type { Funcionario } from "@/src/models/funcionario.model";

const LIMIT = 12;

function AlocacoesContent() {
  const { showToast } = useToast();
  const { user } = useAuth();

  const isAdmin = user?.roles.includes(Role.ADMIN) ?? false;

  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [funcionarios, setFuncionarios] = useState<Funcionario[]>([]);

  const [showFilters, setShowFilters] = useState(false);
  const [dataHoraInicio, setDataHoraInicio] = useState("");
  const [dataHoraFim, setDataHoraFim] = useState("");
  const [funcionarioId, setFuncionarioId] = useState("");
  const [clienteId, setClienteId] = useState("");
  const [ft, setFt] = useState<boolean | undefined>(undefined);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingAlocacao, setEditingAlocacao] = useState<Alocacao | null>(null);
  const [loadingEdit, setLoadingEdit] = useState(false);

  const list = usePaginatedList<Alocacao>({
    fetchFn: alocacaoService.list,
    basePath: "/home/rotina/alocacoes",
    defaultSort: { field: "dataHoraInicio", order: "DESC" },
    limit: LIMIT,
    filters: {
      dataHoraInicio:
        dataHoraInicio.length === 10 && isValidDate(dataHoraInicio)
          ? dataHoraInicio
          : undefined,
      dataHoraFim:
        dataHoraFim.length === 10 && isValidDate(dataHoraFim)
          ? dataHoraFim
          : undefined,
      funcionarioId: funcionarioId ? parseInt(funcionarioId) : undefined,
      clienteId: clienteId ? parseInt(clienteId) : undefined,
      ft: ft,
    },
    errorMessage: "Erro ao carregar alocações",
  });

  const hasActiveFilters =
    list.search ||
    dataHoraInicio ||
    dataHoraFim ||
    funcionarioId ||
    clienteId ||
    ft;

  useEffect(() => {
    const load = async () => {
      try {
        const [cRes, fRes] = await Promise.all([
          clienteService.list({
            limit: 1000,
            sortBy: "nome",
            sortOrder: "ASC",
            ativo: true,
          }),
          funcionarioService.list({ sortBy: "nome", sortOrder: "ASC" }),
        ]);
        if (cRes.success && cRes.data) setClientes(cRes.data.items);
        if (fRes.success && fRes.data)
          setFuncionarios(fRes.data.items as Funcionario[]);
      } catch {}
    };
    load();
  }, []);

  const handleDelete = async (id: number) => {
    if (!confirm("Tem certeza que deseja excluir esta alocação?")) return;
    try {
      const response = await alocacaoService.remove(id);
      if (response.success) {
        showToast({
          type: "success",
          message: "Alocação excluída com sucesso",
        });
        list.refetch();
      } else {
        showToast({
          type: "error",
          message: response.message || "Erro ao excluir alocação",
        });
      }
    } catch {
      showToast({ type: "error", message: "Erro ao excluir alocação" });
    }
  };

  const handleEdit = async (alocacao: Alocacao) => {
    setLoadingEdit(true);
    try {
      const response = await alocacaoService.getById(alocacao.id);
      if (response.success && response.data) {
        setEditingAlocacao(response.data);
        setModalOpen(true);
      } else {
        showToast({
          type: "error",
          message: response.message || "Erro ao carregar alocação",
        });
      }
    } catch {
      showToast({ type: "error", message: "Erro ao carregar alocação" });
    } finally {
      setLoadingEdit(false);
    }
  };

  const handleOpenNew = () => {
    setEditingAlocacao(null);
    setModalOpen(true);
  };

  const handleModalClose = () => {
    setModalOpen(false);
    setEditingAlocacao(null);
  };

  const clearFilters = () => {
    list.setSearch("");
    setDataHoraInicio("");
    setDataHoraFim("");
    setFuncionarioId("");
    setClienteId("");
    setFt(undefined);
    setShowFilters(false);
  };

  return (
    <AuthGuard>
      <SidebarShell>
        <div className="w-full max-w-7xl mx-auto p-6 space-y-6">
          <PageHeader
            title="Alocações"
            subtitle="Gerencie a alocação de funcionários nos serviços"
            onAdd={handleOpenNew}
            addLabel="+ Nova Alocação"
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
              <p className="text-sm text-white/50">
                {list.loading
                  ? "Carregando..."
                  : `${list.meta.total} alocação(ões)`}
              </p>

              <div className="flex gap-2 items-center flex-wrap">
                <select
                  value={list.sortBy}
                  onChange={(e) => list.setSortBy(e.target.value)}
                  className="rounded-lg bg-white/10 text-white text-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#DB9437] border border-white/10 [&>option]:bg-white [&>option]:text-gray-900"
                >
                  <option value="createdAt">Ordenar: Cadastro</option>
                  <option value="dataHoraInicio">Ordenar: Data início</option>
                  <option value="dataHoraFim">Ordenar: Data fim</option>
                  <option value="funcionarioNome">Ordenar: Funcionário</option>
                  <option value="clienteNome">Ordenar: Cliente</option>
                </select>

                <button
                  onClick={list.toggleSortOrder}
                  title={list.sortOrder === "ASC" ? "Crescente" : "Decrescente"}
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
                      Data Início (Até)
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
                  <div>
                    <label className="block text-xs font-medium text-white/60 mb-1">
                      Funcionário
                    </label>
                    <select
                      value={funcionarioId}
                      onChange={(e) => setFuncionarioId(e.target.value)}
                      className="w-full rounded-lg bg-white/95 text-gray-900 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#DB9437]"
                    >
                      <option value="">Todos</option>
                      {funcionarios.map((funcaionario) => (
                        <option key={funcaionario.id} value={funcaionario.id}>
                          {funcaionario.nome}
                        </option>
                      ))}
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
                </div>

                <div className="flex items-center justify-between flex-wrap gap-3">
                  <div className="flex items-center gap-2">
                    <label className="text-sm text-white/60">
                      Hora Extra (FT):
                    </label>
                    <select
                      value={
                        ft === true
                          ? "true"
                          : ft === false
                            ? "false"
                            : undefined
                      }
                      onChange={(e) =>
                        setFt(
                          e.target.value === "true"
                            ? true
                            : e.target.value === "false"
                              ? false
                              : undefined,
                        )
                      }
                      className="rounded-lg bg-white/95 text-gray-900 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#DB9437]"
                    >
                      <option value="">Todos</option>
                      <option value="true">Apenas FT</option>
                      <option value="false">Sem FT</option>
                    </select>
                  </div>
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

          {/* Grid de cards */}
          {list.loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <div
                  key={i}
                  className="bg-linear-to-b from-[#1D3A4A] to-[#102736] rounded-xl p-5 border border-white/10 animate-pulse"
                >
                  <div className="h-4 bg-white/10 rounded mb-3 w-3/4" />
                  <div className="h-3 bg-white/10 rounded mb-2 w-1/2" />
                  <div className="h-3 bg-white/10 rounded mb-4 w-2/3" />
                  <div className="h-px bg-white/10 mb-3" />
                  <div className="h-3 bg-white/10 rounded mb-2 w-full" />
                  <div className="h-3 bg-white/10 rounded w-4/5" />
                </div>
              ))}
            </div>
          ) : list.items.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <span className="text-5xl mb-4">📋</span>
              <p className="text-white/60 text-lg font-medium mb-2">
                Nenhuma alocação encontrada
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
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {list.items.map((alocacao) => (
                  <AlocacaoCard
                    key={alocacao.id}
                    alocacao={alocacao}
                    isAdmin={isAdmin}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    loadingEdit={loadingEdit}
                  />
                ))}
              </div>

              <Pagination
                meta={list.meta}
                onPageChange={list.handlePageChange}
                label="alocação(ões)"
              />
            </>
          )}
        </div>

        {/* Modal compartilhado */}
        <AlocacaoModal
          isOpen={modalOpen}
          onClose={handleModalClose}
          onSuccess={list.refetch}
          editingAlocacao={editingAlocacao}
        />
      </SidebarShell>
    </AuthGuard>
  );
}

export default function AlocacoesPage() {
  return (
    <Suspense fallback={null}>
      <AlocacoesContent />
    </Suspense>
  );
}
