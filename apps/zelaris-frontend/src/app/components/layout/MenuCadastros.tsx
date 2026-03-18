"use client";

import { useState } from "react";
import Link from "next/link";

export function MenuCadastros() {
  const [cadastrosOpen, setCadastrosOpen] = useState(true);

  return (
    <div>
      <button
        className="flex items-center justify-between w-full px-3 py-2 rounded hover:bg-[#14232B]/60 transition text-left"
        onClick={() => setCadastrosOpen((v) => !v)}
        aria-expanded={cadastrosOpen}
      >
        <span className="flex items-center gap-2">
          <span className="text-xm text-white/90 tracking-wider">
            Cadastros
          </span>
          <svg
            width="16"
            height="16"
            fill="none"
            stroke="white"
            strokeWidth="2"
            viewBox="0 0 24 24"
            className={`transition-transform ${
              cadastrosOpen ? "" : "-rotate-90"
            }`}
          >
            <path d="M6 9l6 6 6-6" />
          </svg>
        </span>
      </button>
      {cadastrosOpen && (
        <div className="pl-6 mt-1 space-y-1">
          <Link
            href="/home/cadastro/funcoes"
            className="flex items-center gap-3 w-full px-2 py-2 rounded hover:bg-[#14232B]/60 transition text-left"
          >
            <span className="inline-block w-6 text-center">
              <svg
                width="20"
                height="20"
                fill="none"
                stroke="white"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path d="M20 6h-4V4c0-1.11-.89-2-2-2h-4c-1.11 0-2 .89-2 2v2H4c-1.11 0-1.99.89-1.99 2L2 19c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2zm-6 0h-4V4h4v2z" />
              </svg>
            </span>
            <span className="text-white">Funções</span>
          </Link>
          <Link
            href="/home/cadastro/funcionarios"
            className="flex items-center gap-3 w-full px-2 py-2 rounded hover:bg-[#14232B]/60 transition text-left"
          >
            <span className="inline-block w-6 text-center">
              <svg
                width="20"
                height="20"
                fill="none"
                stroke="white"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
              </svg>
            </span>
            <span className="text-white">Funcionários</span>
          </Link>
          <Link
            href="/home/cadastro/clientes"
            className="flex items-center gap-3 w-full px-2 py-2 rounded hover:bg-[#14232B]/60 transition text-left"
          >
            <span className="inline-block w-6 text-center">
              <svg
                width="20"
                height="20"
                fill="none"
                stroke="white"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z" />
              </svg>
            </span>
            <span className="text-white">Clientes</span>
          </Link>
        </div>
      )}
    </div>
  );
}
