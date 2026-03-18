"use client";

import { AuthGuard } from "@/src/app/auth/components/AuthGuard";
import { SidebarShell } from "@/src/app/components/layout/SidebarShell";
import { useAuth } from "../auth/hooks/useAuth";

export default function HomePage() {
  const { user } = useAuth();

  return (
    <AuthGuard>
      <SidebarShell>
        <div className="max-w-2xl w-full bg-gradient-to-b from-[#1D3A4A] to-[#102736] rounded-2xl shadow-2xl p-8 space-y-6 mx-auto mt-10">
          <div className="text-center space-y-4">
            <h1 className="text-3xl font-bold text-white">
              Bem-vindo, {user?.nome}!
            </h1>
            <p className="text-white/70">
              Você está autenticado no sistema ZELARIS
            </p>
          </div>
          <div className="space-y-3 text-sm text-white/80">
            <div className="flex justify-between py-2 border-b border-white/10">
              <span className="font-medium">Nome:</span>
              <span>{user?.nome}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-white/10">
              <span className="font-medium">CPF:</span>
              <span>{user?.cpf}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-white/10">
              <span className="font-medium">Email:</span>
              <span>{user?.email}</span>
            </div>
            {user?.telefone && (
              <div className="flex justify-between py-2 border-b border-white/10">
                <span className="font-medium">Telefone:</span>
                <span>{user.telefone}</span>
              </div>
            )}
            <div className="flex justify-between py-2">
              <span className="font-medium">Roles:</span>
              <span>{user?.roles.join(", ")}</span>
            </div>
          </div>
        </div>
      </SidebarShell>
    </AuthGuard>
  );
}
