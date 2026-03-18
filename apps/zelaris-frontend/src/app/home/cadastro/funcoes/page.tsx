"use client";

import { useState, Suspense } from "react";
import { useRouter } from "next/navigation";
import { AuthGuard } from "@/src/app/auth/components/AuthGuard";
import { SidebarShell } from "@/src/app/components/layout/SidebarShell";
import { PageHeader } from "@/src/app/components/list/PageHeader";
import { Pagination } from "@/src/app/components/list/Pagination";
import { DataTable, type Column } from "@/src/app/components/list/DataTable";
import { usePaginatedList } from "@/src/hooks/usePaginatedList";
import { funcaoService } from "@/src/services/funcao.service";
import { useToast } from "@/src/app/components/ui/ToastProvider";
import { useAuth } from "@/src/app/auth/hooks/useAuth";
import { Role } from "@/src/models/user.model";
import type { Funcao } from "@/src/models/funcao.model";
import { TipoPagamento } from "@/src/enums";

function FuncoesContent() {
  const router = useRouter();
  const { showToast } = useToast();
  const { user } = useAuth();

  const yearNow = new Date().getFullYear().toString();
  const [ano, setAno] = useState(yearNow);
  const [tipoPagamento, setTipoPagamento] = useState<string>("");
  const [showFilters, setShowFilters] = useState(false);

  const list = usePaginatedList<Funcao>({
    fetchFn: funcaoService.list,
    basePath: "/home/cadastro/funcoes",
    defaultSort: { field: "anoVigente", order: "DESC" },
    filters: {
      ano: ano.length > 3 ? parseInt(ano) : undefined,
      tipoPagamento: tipoPagamento || undefined,
    },
    errorMessage: "Erro ao carregar funções",
  });

  const hasActiveFilters = list.search || ano || tipoPagamento;

  const handleDelete = async (id: number) => {
    if (!confirm("Tem certeza que deseja excluir esta função?")) return;
    try {
      const response = await funcaoService.delete(id);
      if (response.success) {
        showToast({ type: "success", message: "Função excluída com sucesso" });
        list.refetch();
      } else {
        showToast({
          type: "error",
          message: response.message || "Erro ao excluir função",
        });
      }
    } catch {
      showToast({ type: "error", message: "Erro ao excluir função" });
    }
  };

  const clearFilters = () => {
    setAno(yearNow);
    setTipoPagamento("");
    setShowFilters(false);
  };

  const columns: Column<Funcao>[] = [
    {
      key: "nome",
      label: "Nome",
      sortable: true,
      render: (funcao) => funcao.nome,
    },
    {
      key: "tipoPagamento",
      label: "Tipo de Pagamento",
      sortable: true,
      render: (funcao) => funcao.tipoPagamento.valueOf(),
    },
    {
      key: "salario",
      label: "Salário",
      sortable: true,
      render: (funcao) =>
        `R$ ${funcao.salario.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`,
    },
    {
      key: "anoVigente",
      label: "Ano Vigente",
      sortable: true,
      render: (funcao) => funcao.anoVigente,
    },
    {
      key: "actions",
      label: "Ações",
      align: "right",
      render: (funcao) =>
        user?.roles.includes(Role.ADMIN) ? (
          <span className="space-x-2">
            <button
              onClick={() => router.push(`/home/cadastro/funcoes/${funcao.id}`)}
              className="text-[#DB9437] hover:text-[#c7812e] font-medium text-sm"
            >
              Editar
            </button>
            <button
              onClick={() => handleDelete(funcao.id)}
              className="text-red-400 hover:text-red-300 font-medium text-sm"
            >
              Excluir
            </button>
          </span>
        ) : (
          <button
            onClick={() => router.push(`/home/cadastro/funcoes/${funcao.id}`)}
            className="text-blue-400 hover:text-blue-300 font-medium text-sm"
          >
            Visualizar
          </button>
        ),
    },
  ];

  return (
    <AuthGuard>
      <SidebarShell>
        <div className="w-full max-w-7xl mx-auto p-6 space-y-6">
          <PageHeader
            title="Funções"
            onAdd={() => router.push("/home/cadastro/funcoes/nova")}
            showAdd={user?.roles.includes(Role.ADMIN)}
          />

          {/* Busca e Filtros */}
          <div className="bg-linear-to-b from-[#1D3A4A] to-[#102736] rounded-lg p-6 space-y-4">
            <div className="flex gap-4">
              <div className="flex-1">
                <label className="block text-sm font-medium text-white/90 mb-2">
                  Buscar:
                </label>
                <input
                  type="text"
                  placeholder="Pesquisar por nome, salário ou ano..."
                  value={list.search}
                  onChange={(e) => list.setSearch(e.target.value)}
                  className="w-full rounded-lg bg-white/95 text-gray-900 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#DB9437]"
                />
              </div>
              <div className="flex items-end">
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

            {showFilters && (
              <div className="pt-4 border-t border-white/10 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-white/90 mb-2">
                      Filtrar por Tipo de Pagamento:
                    </label>
                    <select
                      value={tipoPagamento}
                      onChange={(e) => setTipoPagamento(e.target.value)}
                      className="w-full rounded-lg bg-white/95 text-gray-900 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#DB9437]"
                    >
                      <option value="">Todos</option>
                      <option value={TipoPagamento.MENSAL}>Mensal</option>
                      <option value={TipoPagamento.DIARIA}>Diaria</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-white/90 mb-2">
                      Filtrar por Ano:
                    </label>
                    <input
                      type="number"
                      placeholder="Ex: 2026"
                      value={ano}
                      onChange={(e) => setAno(e.target.value)}
                      className="w-full rounded-lg bg-white/95 text-gray-900 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#DB9437]"
                    />
                  </div>
                </div>
                <div className="flex justify-end">
                  <button
                    onClick={clearFilters}
                    className="text-white/70 hover:text-white text-sm font-medium"
                  >
                    Limpar filtros
                  </button>
                </div>
              </div>
            )}
          </div>

          <DataTable
            columns={columns}
            data={list.items}
            loading={list.loading}
            emptyMessage="Nenhuma função encontrada"
            keyExtractor={(funcao) => funcao.id}
            sortBy={list.sortBy}
            onSort={list.handleSort}
            getSortIcon={list.getSortIcon}
          />

          <Pagination
            meta={list.meta}
            onPageChange={list.handlePageChange}
            label="funções"
          />
        </div>
      </SidebarShell>
    </AuthGuard>
  );
}

export default function FuncoesPage() {
  return (
    <Suspense fallback={null}>
      <FuncoesContent />
    </Suspense>
  );
}
