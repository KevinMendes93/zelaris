"use client";

import { useRouter } from "next/navigation";
import { AuthGuard } from "@/src/app/auth/components/AuthGuard";
import { SidebarShell } from "@/src/app/components/layout/SidebarShell";

interface FormPageShellProps {
  title: string;
  backPath: string;
  maxWidth?: string;
  loading?: boolean;
  children: React.ReactNode;
}

export function FormPageShell({
  title,
  backPath,
  maxWidth = "max-w-7xl",
  loading = false,
  children,
}: FormPageShellProps) {
  const router = useRouter();

  return (
    <AuthGuard>
      <SidebarShell>
        <div className={`w-full ${maxWidth} mx-auto p-6`}>
          <div className="bg-linear-to-b from-[#1D3A4A] to-[#102736] rounded-2xl shadow-2xl p-8 space-y-6">
            {loading ? (
              <div className="text-center text-white py-8">Carregando...</div>
            ) : (
              <>
                <div className="flex items-center justify-between">
                  <h1 className="text-3xl font-bold text-white">{title}</h1>
                  <button
                    onClick={() => router.push(backPath)}
                    className="text-white/80 hover:text-white transition text-sm"
                  >
                    ← Voltar
                  </button>
                </div>
                {children}
              </>
            )}
          </div>
        </div>
      </SidebarShell>
    </AuthGuard>
  );
}
