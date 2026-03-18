"use client";

import { useState, Suspense } from "react";
import { useRouter } from "next/navigation";
import { AuthGuard } from "@/src/app/auth/components/AuthGuard";
import { SidebarShell } from "@/src/app/components/layout/SidebarShell";
import { PageHeader } from "@/src/app/components/list/PageHeader";
import { Pagination } from "@/src/app/components/list/Pagination";
import { DataTable, type Column } from "@/src/app/components/list/DataTable";
import { usePaginatedList } from "@/src/hooks/usePaginatedList";
import { funcionarioService } from "@/src/services/funcionario.service";
import { useToast } from "@/src/app/components/ui/ToastProvider";
import { useAuth } from "@/src/app/auth/hooks/useAuth";
import { Role } from "@/src/models/user.model";
import type { Funcionario } from "@/src/models/funcionario.model";
import { formatTelefone, formatDate, maskDate } from "@/src/lib/formatters";

function FuncionariosContent() {
  const router = useRouter();
  const { showToast } = useToast();
  const { user } = useAuth();

  const [createdAtFrom, setCreatedAtFrom] = useState("");
  const [createdAtTo, setCreatedAtTo] = useState("");
  const [freelancer, setFreelancer] = useState("");
  const [ativo, setAtivo] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  const list = usePaginatedList<Funcionario>({
    fetchFn: funcionarioService.list,
    basePath: "/home/cadastro/funcionarios",
    defaultSort: { field: "createdAt", order: "DESC" },
    filters: {
      freelancer: freelancer ? freelancer === "true" : undefined,
      ativo: ativo ? ativo === "true" : undefined,
      createdAtFrom: createdAtFrom || undefined,
      createdAtTo: createdAtTo || undefined,
    },
    errorMessage: "Erro ao carregar funcionários",
  });

  const hasActiveFilters =
    list.search || freelancer || ativo || createdAtFrom || createdAtTo;

  const handleDelete = async (id: number) => {
    if (!confirm("Tem certeza que deseja excluir este funcionário?")) return;
    try {
      const response = await funcionarioService.delete(id);
      if (response.success) {
        showToast({
          type: "success",
          message: "Funcionário excluído com sucesso",
        });
        list.refetch();
      } else {
        showToast({
          type: "error",
          message: response.message || "Erro ao excluir funcionário",
        });
      }
    } catch {
      showToast({ type: "error", message: "Erro ao excluir funcionário" });
    }
  };

  const handleToggleAtivo = async (id: number) => {
    if (!confirm("Tem certeza que deseja alterar o status deste funcionário?"))
      return;
    try {
      const response = await funcionarioService.toggleAtivo(id);
      if (response.success) {
        showToast({
          type: "success",
          message: "Status do funcionário alterado com sucesso",
        });
        list.refetch();
      } else {
        showToast({
          type: "error",
          message: response.message || "Erro ao alterar status",
        });
      }
    } catch {
      showToast({ type: "error", message: "Erro ao alterar status" });
    }
  };

  const clearFilters = () => {
    setCreatedAtFrom("");
    setCreatedAtTo("");
    setFreelancer("");
    setAtivo("");
    setShowFilters(false);
  };

  const columns: Column<Funcionario>[] = [
    {
      key: "nome",
      label: "Nome",
      sortable: true,
      render: (funcionario) => funcionario.nome,
    },
    {
      key: "cpf",
      label: "CPF",
      sortable: true,
      render: (funcionario) => funcionario.cpf,
    },
    {
      key: "email",
      label: "Email",
      sortable: true,
      render: (funcionario) => funcionario.email || "-",
    },
    {
      key: "telefone",
      label: "Telefone",
      sortable: true,
      render: (funcionario) => formatTelefone(funcionario.telefone),
    },
    {
      key: "createdAt",
      label: "Data cadastro",
      sortable: true,
      render: (funcionario) => formatDate(funcionario.createdAt!),
    },
    {
      key: "freelancer",
      label: "Freelancer",
      sortable: true,
      render: (funcionario) => (
        <span
          className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
            funcionario.freelancer
              ? "bg-green-600 text-white"
              : "bg-red-600 text-white"
          }`}
        >
          {funcionario.freelancer ? "Sim" : "Não"}
        </span>
      ),
    },
    {
      key: "ativo",
      label: "Ativo",
      sortable: true,
      render: (funcionario) => (
        <button
          onClick={() => handleToggleAtivo(funcionario.id!)}
          disabled={!user?.roles.includes(Role.ADMIN)}
          className={`inline-block px-3 py-1 rounded-full text-xs font-semibold cursor-pointer hover:opacity-80 disabled:cursor-not-allowed ${
            funcionario.ativo
              ? "bg-green-600 text-white"
              : "bg-red-600 text-white"
          }`}
        >
          {funcionario.ativo ? "Sim" : "Não"}
        </button>
      ),
    },
    {
      key: "actions",
      label: "Ações",
      align: "right",
      render: (funcionario) =>
        user?.roles.includes(Role.ADMIN) ? (
          <span className="space-x-2">
            <button
              onClick={() =>
                router.push(`/home/cadastro/funcionarios/${funcionario.id}`)
              }
              className="text-[#DB9437] hover:text-[#c7812e] font-medium text-sm"
            >
              Editar
            </button>
            <button
              onClick={() => handleDelete(funcionario.id!)}
              className="text-red-400 hover:text-red-300 font-medium text-sm"
            >
              Excluir
            </button>
          </span>
        ) : (
          <button
            onClick={() =>
              router.push(`/home/cadastro/funcionarios/${funcionario.id}`)
            }
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
            title="Funcionários"
            onAdd={() => router.push("/home/cadastro/funcionarios/nova")}
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
                  placeholder="Pesquisar por nome, CPF, email ou data (DD/MM/YYYY)..."
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
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-white/90 mb-2">
                      Tipo:
                    </label>
                    <select
                      value={freelancer}
                      onChange={(e) => setFreelancer(e.target.value)}
                      className="w-full rounded-lg bg-white/95 text-gray-900 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#DB9437]"
                    >
                      <option value="">Todos</option>
                      <option value="true">Freelancers</option>
                      <option value="false">Não Freelancers</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-white/90 mb-2">
                      Ativo:
                    </label>
                    <select
                      value={ativo}
                      onChange={(e) => setAtivo(e.target.value)}
                      className="w-full rounded-lg bg-white/95 text-gray-900 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#DB9437]"
                    >
                      <option value="">Todos</option>
                      <option value="true">Ativo</option>
                      <option value="false">Inativo</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-white/90 mb-2">
                      Data cadastro (De):
                    </label>
                    <input
                      type="text"
                      placeholder="DD/MM/YYYY"
                      value={createdAtFrom}
                      onChange={(e) =>
                        setCreatedAtFrom(maskDate(e.target.value))
                      }
                      maxLength={10}
                      className="w-full rounded-lg bg-white/95 text-gray-900 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#DB9437]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-white/90 mb-2">
                      Data cadastro (Até):
                    </label>
                    <input
                      type="text"
                      placeholder="DD/MM/YYYY"
                      value={createdAtTo}
                      onChange={(e) => setCreatedAtTo(maskDate(e.target.value))}
                      maxLength={10}
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
            emptyMessage="Nenhum funcionário encontrado"
            keyExtractor={(funcionario) => funcionario.id!}
            sortBy={list.sortBy}
            onSort={list.handleSort}
            getSortIcon={list.getSortIcon}
          />

          <Pagination
            meta={list.meta}
            onPageChange={list.handlePageChange}
            label="funcionários"
          />
        </div>
      </SidebarShell>
    </AuthGuard>
  );
}

export default function FuncionariosPage() {
  return (
    <Suspense fallback={null}>
      <FuncionariosContent />
    </Suspense>
  );
}
