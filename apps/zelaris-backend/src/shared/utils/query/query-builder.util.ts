import { ObjectLiteral, SelectQueryBuilder } from 'typeorm';

export type SortFieldConfig = {
  field: string;
  isRelation?: boolean;
};

export function resolveSortField(
  sort: string | undefined,
  sortFieldMap: Record<string, SortFieldConfig>,
  fallback: SortFieldConfig,
): SortFieldConfig {
  return sortFieldMap[sort ?? ''] ?? fallback;
}

export function applyOrderBy<T extends ObjectLiteral>(
  queryBuilder: SelectQueryBuilder<T>,
  alias: string,
  sortField: SortFieldConfig,
  order: 'ASC' | 'DESC',
): void {
  const field = sortField.isRelation
    ? sortField.field
    : `${alias}.${sortField.field}`;
  queryBuilder.orderBy(field, order);
}

export function applyPagination<T extends ObjectLiteral>(
  queryBuilder: SelectQueryBuilder<T>,
  page: number,
  limit: number,
): void {
  const skip = (page - 1) * limit;
  queryBuilder.skip(skip).take(limit);
}
