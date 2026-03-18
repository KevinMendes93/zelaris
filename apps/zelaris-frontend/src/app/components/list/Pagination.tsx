import type { PaginationMeta } from "@/src/models/pagination.model";

interface PaginationProps {
  meta: PaginationMeta;
  onPageChange: (page: number) => void;
  label?: string;
}

export function Pagination({
  meta,
  onPageChange,
  label = "itens",
}: PaginationProps) {
  if (meta.totalPages <= 1) return null;

  return (
    <div className="flex justify-between items-center px-1 py-2">
      <p className="text-sm text-white/50">
        Mostrando {(meta.page - 1) * meta.limit + 1}–
        {Math.min(meta.page * meta.limit, meta.total)} de {meta.total} {label}
      </p>
      <div className="flex gap-2 items-center">
        <button
          onClick={() => onPageChange(meta.page - 1)}
          disabled={meta.page === 1}
          className="px-4 py-2 rounded-lg bg-white/10 text-white hover:bg-white/20 disabled:opacity-40 disabled:cursor-not-allowed transition text-sm"
        >
          ← Anterior
        </button>
        <span className="px-3 py-2 text-white/70 text-sm">
          {meta.page} / {meta.totalPages}
        </span>
        <button
          onClick={() => onPageChange(meta.page + 1)}
          disabled={meta.page >= meta.totalPages}
          className="px-4 py-2 rounded-lg bg-white/10 text-white hover:bg-white/20 disabled:opacity-40 disabled:cursor-not-allowed transition text-sm"
        >
          Próxima →
        </button>
      </div>
    </div>
  );
}
