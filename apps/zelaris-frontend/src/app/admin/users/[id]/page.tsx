"use client";

import { AuthGuard } from "@/src/app/auth/components/AuthGuard";
import { AdminGuard } from "@/src/app/auth/components/AdminGuard";
import { SidebarShell } from "@/src/app/components/layout/SidebarShell";
import { userService } from "@/src/services/user.service";
import type { User } from "@/src/models/user.model";
import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { useToast } from "@/src/app/components/ui/ToastProvider";

export default function AdminUserDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const { showToast } = useToast();
  const userId = params.id ? parseInt(params.id as string) : null;

  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) {
      showToast({ type: "error", message: "ID de usuário inválido" });
      router.push("/admin/users");
      return;
    }

    const fetchUser = async () => {
      try {
        setLoading(true);
        const response = await userService.getById(userId);

        if (response.success && response.data) {
          setUser(response.data);
        } else {
          showToast({
            type: "error",
            message: response.message || "Erro ao carregar usuário",
          });
          router.push("/admin/users");
        }
      } catch {
        showToast({ type: "error", message: "Erro ao carregar usuário" });
        router.push("/admin/users");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [userId, router, showToast]);

  if (loading) {
    return (
      <AuthGuard>
        <AdminGuard>
          <SidebarShell>
            <div className="w-full max-w-4xl mx-auto p-6">
              <div className="text-center py-12 text-white">Carregando...</div>
            </div>
          </SidebarShell>
        </AdminGuard>
      </AuthGuard>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <AuthGuard>
      <AdminGuard>
        <SidebarShell>
          <div className="w-full max-w-4xl mx-auto p-6 space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
              <h1 className="text-3xl font-bold text-white">
                Detalhes do Usuário
              </h1>
              <button
                onClick={() => router.push("/admin/users")}
                className="bg-[#5259E3] hover:bg-[#3A3FA1] text-white font-semibold px-6 py-2 rounded-lg transition"
              >
                Voltar
              </button>
            </div>

            {/* Card de Detalhes */}
            <div className="bg-gradient-to-b from-[#1D3A4A] to-[#102736] rounded-lg p-8 space-y-6">
              {/* ID e Roles */}
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div>
                  <p className="text-sm text-white/60">ID</p>
                  <p className="text-xl font-semibold text-white">{user.id}</p>
                </div>
                <div className="flex gap-2">
                  {user.roles.map((role) => (
                    <span
                      key={role}
                      className={`px-3 py-1 rounded-full text-sm font-semibold ${
                        role === "ADMIN"
                          ? "bg-purple-500/20 text-purple-300"
                          : "bg-blue-500/20 text-blue-300"
                      }`}
                    >
                      {role}
                    </span>
                  ))}
                </div>
              </div>

              {/* Informações Pessoais */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-white/60 mb-2">
                    Nome Completo
                  </label>
                  <p className="text-lg text-white bg-white/5 px-4 py-3 rounded-lg">
                    {user.nome}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-white/60 mb-2">
                    CPF
                  </label>
                  <p className="text-lg text-white bg-white/5 px-4 py-3 rounded-lg">
                    {user.cpf}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-white/60 mb-2">
                    Email
                  </label>
                  <p className="text-lg text-white bg-white/5 px-4 py-3 rounded-lg break-all">
                    {user.email}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-white/60 mb-2">
                    Telefone
                  </label>
                  <p className="text-lg text-white bg-white/5 px-4 py-3 rounded-lg">
                    {user.telefone || "Não informado"}
                  </p>
                </div>
              </div>

              {/* Roles detalhadas */}
              <div>
                <label className="block text-sm font-medium text-white/60 mb-2">
                  Permissões
                </label>
                <div className="bg-white/5 px-4 py-3 rounded-lg">
                  <ul className="list-disc list-inside space-y-1 text-white">
                    {user.roles.map((role) => (
                      <li key={role}>
                        {role === "ADMIN" ? (
                          <span>
                            <strong>Administrador</strong> - Acesso completo ao
                            sistema
                          </span>
                        ) : (
                          <span>
                            <strong>Usuário</strong> - Acesso padrão ao sistema
                          </span>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </SidebarShell>
      </AdminGuard>
    </AuthGuard>
  );
}
