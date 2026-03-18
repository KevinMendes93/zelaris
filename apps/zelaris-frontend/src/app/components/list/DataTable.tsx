import { type ReactNode } from "react";

export interface Column<T> {
  key: string;
  label: string;
  sortable?: boolean;
  align?: "left" | "center" | "right";
  render: (item: T, index: number) => ReactNode;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  loading: boolean;
  emptyMessage?: string;
  keyExtractor: (item: T) => string | number;
  sortBy: string;
  onSort: (field: string) => void;
  getSortIcon: (field: string) => string;
}

export function DataTable<T>({
  columns,
  data,
  loading,
  emptyMessage = "Nenhum registro encontrado",
  keyExtractor,
  onSort,
  getSortIcon,
}: DataTableProps<T>) {
  return (
    <div className="bg-linear-to-b from-[#1D3A4A] to-[#102736] rounded-lg overflow-hidden">
      {loading ? (
        <div className="text-center py-12 text-white">Carregando...</div>
      ) : data.length === 0 ? (
        <div className="text-center py-12 text-white/70">{emptyMessage}</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[#0F2736] border-b border-white/10">
              <tr>
                {columns.map((column) => {
                  const alignClass =
                    column.align === "center"
                      ? "text-center"
                      : column.align === "right"
                        ? "text-right"
                        : "text-left";

                  return (
                    <th
                      key={column.key}
                      className={`px-6 py-4 text-sm font-semibold text-white ${alignClass} ${
                        column.sortable ? "cursor-pointer hover:bg-white/5" : ""
                      }`}
                      onClick={
                        column.sortable ? () => onSort(column.key) : undefined
                      }
                    >
                      {column.label}{" "}
                      {column.sortable && getSortIcon(column.key)}
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {data.map((item, index) => (
                <tr
                  key={keyExtractor(item)}
                  className={`hover:bg-white/5 transition ${
                    index % 2 === 1 ? "bg-[#091822]/30" : ""
                  }`}
                >
                  {columns.map((column) => {
                    const alignClass =
                      column.align === "center"
                        ? "text-center"
                        : column.align === "right"
                          ? "text-right"
                          : "";

                    return (
                      <td
                        key={column.key}
                        className={`px-6 py-4 text-sm text-white ${alignClass}`}
                      >
                        {column.render(item, index)}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
