"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useToast } from "@/src/app/components/ui/ToastProvider";
import type { ApiResponse } from "@/src/models/api.model";
import type {
  PaginatedResponse,
  PaginationMeta,
} from "@/src/models/pagination.model";

interface UsePaginatedListOptions<TItem> {
  fetchFn: (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    params: any
  ) => Promise<ApiResponse<PaginatedResponse<TItem>>>;
  basePath: string;
  defaultSort?: { field: string; order: "ASC" | "DESC" };
  limit?: number;
  filters?: Record<string, unknown>;
  errorMessage?: string;
}

export interface UsePaginatedListReturn<TItem> {
  items: TItem[];
  loading: boolean;
  meta: PaginationMeta;
  search: string;
  setSearch: (value: string) => void;
  sortBy: string;
  setSortBy: (field: string) => void;
  sortOrder: "ASC" | "DESC";
  setSortOrder: (order: "ASC" | "DESC") => void;
  toggleSortOrder: () => void;
  handleSort: (field: string) => void;
  getSortIcon: (field: string) => string;
  handlePageChange: (page: number) => void;
  currentPage: number;
  refetch: () => void;
}

export function usePaginatedList<TItem>({
  fetchFn,
  basePath,
  defaultSort = { field: "createdAt", order: "DESC" },
  limit = 15,
  filters = {},
  errorMessage = "Erro ao carregar dados",
}: UsePaginatedListOptions<TItem>): UsePaginatedListReturn<TItem> {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { showToast } = useToast();

  const [items, setItems] = useState<TItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [meta, setMeta] = useState<PaginationMeta>({
    page: 1,
    limit,
    total: 0,
    totalPages: 0,
  });
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState(defaultSort.field);
  const [sortOrder, setSortOrder] = useState(defaultSort.order);

  const currentPage = parseInt(searchParams.get("page") || "1");
  const filtersKey = JSON.stringify(filters);

  const fetchData = useCallback(async () => {
    if (search.length === 1) {
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const response = await fetchFn({
        page: currentPage,
        limit,
        sortBy,
        sortOrder,
        search: search.length >= 2 ? search : undefined,
        ...filters,
      });

      if (response.success && response.data) {
        setItems(response.data.items);
        setMeta(response.data.meta);
      } else {
        showToast({
          type: "error",
          message: response.message || errorMessage,
        });
      }
    } catch {
      showToast({ type: "error", message: errorMessage });
    } finally {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, limit, sortBy, sortOrder, search, filtersKey]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const fetchDataRef = useRef(fetchData);
  fetchDataRef.current = fetchData;
  const refetch = useCallback(() => {
    fetchDataRef.current();
  }, []);

  const handlePageChange = (page: number) => {
    router.push(`${basePath}?page=${page}`);
  };

  const handleSort = (field: string) => {
    if (sortBy === field) {
      setSortOrder((prev) => (prev === "ASC" ? "DESC" : "ASC"));
    } else {
      setSortBy(field);
      setSortOrder("ASC");
    }
  };

  const toggleSortOrder = () => {
    setSortOrder((prev) => (prev === "ASC" ? "DESC" : "ASC"));
  };

  const getSortIcon = (field: string) => {
    if (sortBy !== field) return "⇅";
    return sortOrder === "ASC" ? "↑" : "↓";
  };

  return {
    items,
    loading,
    meta,
    search,
    setSearch,
    sortBy,
    setSortBy,
    sortOrder,
    setSortOrder,
    toggleSortOrder,
    handleSort,
    getSortIcon,
    handlePageChange,
    currentPage,
    refetch,
  };
}
