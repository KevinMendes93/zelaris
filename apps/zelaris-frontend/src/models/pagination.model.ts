/**
 * Models genéricos de paginação reutilizáveis em toda a aplicação
 */
export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface PaginatedResponse<T> {
  items: T[];
  meta: PaginationMeta;
}

export interface BasePaginationFilters {
  page?: number;
  limit?: number;
  sortOrder?: 'ASC' | 'DESC';
  search?: string;
}
