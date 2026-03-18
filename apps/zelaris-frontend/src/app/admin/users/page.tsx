"use client";

import { Suspense } from "react";
import { useRouter } from "next/navigation";
import { AuthGuard } from "@/src/app/auth/components/AuthGuard";
import { AdminGuard } from "@/src/app/auth/components/AdminGuard";
import { SidebarShell } from "@/src/app/components/layout/SidebarShell";
import { PageHeader } from "@/src/app/components/list/PageHeader";
import { Pagination } from "@/src/app/components/list/Pagination";
import { DataTable, type Column } from "@/src/app/components/list/DataTable";
import { usePaginatedList } from "@/src/hooks/usePaginatedList";
import { userService } from "@/src/services/user.service";
import type { User } from "@/src/models/user.model";

function AdminUsersContent() {
  const router = useRouter();

  const list = usePaginatedList<User>({
    fetchFn: userService.list,
    basePath: "/admin/users",
    defaultSort: { field: "nome", order: "ASC" },
    errorMessage: "Erro ao carregar usuários",
  });

  const columns: Column<User>[] = [
    { key: "nome", label: "Nome", sortable: true, render: (user) => user.nome },
    { key: "cpf", label: "CPF", sortable: true, render: (user) => user.cpf },
    {
      key: "email",
      label: "Email",
      sortable: true,
      render: (user) => user.email,
    },
    {
      key: "telefone",
      label: "Telefone",
      sortable: true,
      render: (user) => user.telefone || "-",
    },
    {
      key: "roles",
      label: "Roles",
      render: (user) => (
        <span className="inline-flex gap-1">
          {user.roles.map((role) => (
            <span
              key={role}
              className={`px-2 py-1 rounded text-xs font-semibold ${
                role === "ADMIN"
                  ? "bg-purple-500/20 text-purple-300"
                  : "bg-blue-500/20 text-blue-300"
              }`}
            >
              {role}
            </span>
          ))}
        </span>
      ),
    },
    {
      key: "actions",
      label: "Ações",
      align: "right",
      render: (user) => (
        <button
          onClick={() => router.push(`/admin/users/${user.id}`)}
          className="text-[#DB9437] hover:text-[#c7812e] font-medium text-sm"
        >
          Detalhes
        </button>
      ),
    },
  ];

  return (
    <AuthGuard>
      <AdminGuard>
        <SidebarShell>
          <div className="w-full max-w-7xl mx-auto p-6 space-y-6">
            <PageHeader title="Usuários" showAdd={false} />

            <div className="bg-linear-to-b from-[#1D3A4A] to-[#102736] rounded-lg p-6">
              <label className="block text-sm font-medium text-white/90 mb-2">
                Buscar:
              </label>
              <input
                type="text"
                placeholder="Pesquisar por nome, CPF, email ou telefone..."
                value={list.search}
                onChange={(e) => list.setSearch(e.target.value)}
                className="w-full rounded-lg bg-white/95 text-gray-900 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#DB9437]"
              />
            </div>

            <DataTable
              columns={columns}
              data={list.items}
              loading={list.loading}
              emptyMessage="Nenhum usuário encontrado"
              keyExtractor={(user) => user.id}
              sortBy={list.sortBy}
              onSort={list.handleSort}
              getSortIcon={list.getSortIcon}
            />

            <Pagination
              meta={list.meta}
              onPageChange={list.handlePageChange}
              label="usuários"
            />
          </div>
        </SidebarShell>
      </AdminGuard>
    </AuthGuard>
  );
}

export default function AdminUsersPage() {
  return (
    <Suspense fallback={null}>
      <AdminUsersContent />
    </Suspense>
  );
}
