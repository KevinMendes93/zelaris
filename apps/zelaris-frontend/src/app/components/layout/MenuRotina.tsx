"use client";

import { useState } from "react";
import Link from "next/link";

export function MenuRotina() {
  const [rotinaOpen, setRotinaOpen] = useState(true);

  return (
    <div>
      <button
        className="flex items-center justify-between w-full px-3 py-2 rounded hover:bg-[#14232B]/60 transition text-left"
        onClick={() => setRotinaOpen((v) => !v)}
        aria-expanded={rotinaOpen}
      >
        <span className="flex items-center gap-2">
          <span className="text-xm text-white/90 tracking-wider">Rotina</span>
          <svg
            width="16"
            height="16"
            fill="none"
            stroke="white"
            strokeWidth="2"
            viewBox="0 0 24 24"
            className={`transition-transform ${rotinaOpen ? "" : "-rotate-90"}`}
          >
            <path d="M6 9l6 6 6-6" />
          </svg>
        </span>
      </button>
      {rotinaOpen && (
        <div className="pl-6 mt-1 space-y-1">
          <Link
            href="/home/rotina/servicos"
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
                <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
              </svg>
            </span>
            <span className="text-white">Serviços</span>
          </Link>
          <Link
            href="/home/rotina/alocacoes"
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
                <path d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </span>
            <span className="text-white">Alocações</span>
          </Link>
        </div>
      )}
    </div>
  );
}
