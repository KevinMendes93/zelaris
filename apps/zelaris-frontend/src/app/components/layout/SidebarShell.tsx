"use client";

import { useState } from "react";
import Image from "next/image";
import { useAuth } from "@/src/app/auth/hooks/useAuth";
import { useRouter } from "next/navigation";
import { Role } from "@/src/models/user.model";
import { MenuCadastros } from "@/src/app/components/layout/MenuCadastros";
import { MenuRotina } from "@/src/app/components/layout/MenuRotina";

export function SidebarShell({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const router = useRouter();

  const menuContent = (
    <nav className="px-2 py-4 space-y-2">
      <MenuCadastros />
      <MenuRotina />
    </nav>
  );

  return (
    <div className="min-h-screen flex flex-col bg-[#14232B]">
      {/* Topbar */}
      <header className="flex items-center justify-between bg-[#1D3A4A] h-16 px-6 shadow-md relative z-20">
        <div className="flex items-center gap-3">
          {/* Mobile: botão menu hambúrguer */}
          <button
            className="md:hidden p-2 mr-2 rounded hover:bg-[#14232B]/40 transition"
            aria-label={mobileMenuOpen ? "Fechar menu" : "Abrir menu"}
            onClick={() => setMobileMenuOpen((v) => !v)}
          >
            {mobileMenuOpen ? (
              <svg
                width="28"
                height="28"
                fill="none"
                stroke="white"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg
                width="28"
                height="28"
                fill="none"
                stroke="white"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
          <button
            onClick={() => router.push("/home")}
            className="hover:opacity-80 transition"
            aria-label="Ir para página inicial"
          >
            <Image
              src="/zelaris-logo.svg"
              alt="ZELARIS Logo"
              width={140}
              height={140}
              className="select-none"
            />
          </button>
        </div>
        <div className="flex items-center gap-3">
          {user?.roles.includes(Role.ADMIN) && (
            <button
              onClick={() => router.push("/admin/users")}
              className="bg-[#3770db] hover:bg-[#3770db]/80 text-white font-semibold px-6 py-2 rounded-xl transition"
            >
              Administração
            </button>
          )}
          <button
            onClick={logout}
            className="bg-[#c7381f] hover:bg-[#c7381f]/80 text-white font-semibold px-6 py-2 rounded-xl transition"
          >
            Sair
          </button>
        </div>
      </header>

      <div className="flex flex-1">
        {/* Sidebar Desktop */}
        <aside
          className={`bg-[#1D3A4A] text-white flex-col transition-all duration-300 hidden md:flex ${
            collapsed ? "w-16" : "w-64"
          }`}
        >
          <div className="flex items-center justify-between h-16 px-4 border-b border-white/10">
            {!collapsed && (
              <span className="font-semibold text-base">Menu</span>
            )}
            <button
              onClick={() => setCollapsed((c) => !c)}
              className="p-2 rounded hover:bg-[#14232B]/40 transition"
              aria-label={collapsed ? "Expandir menu" : "Contrair menu"}
            >
              {collapsed ? (
                <svg
                  width="24"
                  height="24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path d="M9 6l6 6-6 6" />
                </svg>
              ) : (
                <svg
                  width="24"
                  height="24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path d="M15 6l-6 6 6 6" />
                </svg>
              )}
            </button>
          </div>
          {collapsed ? null : menuContent}
        </aside>

        {/* Sidebar Mobile (dropdown) */}
        {mobileMenuOpen && (
          <div
            className="fixed inset-0 z-10 md:hidden"
            onClick={() => setMobileMenuOpen(false)}
          >
            <div
              className="absolute top-16 left-0 w-full bg-[#1D3A4A] shadow-lg animate-fade-in-down"
              onClick={(e) => e.stopPropagation()}
            >
              {menuContent}
            </div>
          </div>
        )}

        {/* Main content */}
        <main className="flex-1 bg-[#14232B] p-8 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
