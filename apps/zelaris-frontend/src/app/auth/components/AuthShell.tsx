import Image from "next/image";

import type { AuthShellProps } from "@/src/models/auth-shell.model";

export function AuthShell({ title, subtitle, children }: AuthShellProps) {
  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-[#14232B] text-white">
      {/* Coluna esquerda - Logo */}
      <div className="w-full md:w-1/2 flex items-center justify-center md:justify-end p-8 md:pr-16">
        <div className="flex flex-col items-center md:items-end">
          <Image
            src="/zelaris-logo.svg"
            alt="ZELARIS Logo"
            width={250}
            height={250}
            className="mb-4"
            priority
          />
        </div>
      </div>

      {/* Coluna direita - Card de autenticação */}
      <div className="w-full md:w-1/2 flex items-center justify-center md:justify-start p-8 md:pl-16">
        <div className="max-w-md w-full rounded-2xl bg-gradient-to-b from-[#1D3A4A] to-[#102736] shadow-2xl px-8 py-10 space-y-6">
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-semibold">{title}</h2>
            {subtitle && <p className="text-sm text-white/70">{subtitle}</p>}
          </div>
          {children}
        </div>
      </div>
    </div>
  );
}
