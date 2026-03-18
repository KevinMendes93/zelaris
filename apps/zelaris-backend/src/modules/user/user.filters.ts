import { PageMeta } from '../../shared/interfaces/page-meta.interface';
import { SelectQueryBuilder } from 'typeorm';
import { User } from './entities/user.entity';
import {
  applyOrderBy,
  applyPagination,
  resolveSortField,
} from '../../shared/utils/query/query-builder.util';

export type UserListFilters = {
  pageMeta: PageMeta;
  search?: string;
};

const sortFieldMap = {
  nome: { field: 'nome' },
  cpf: { field: 'cpf' },
  email: { field: 'email' },
  telefone: { field: 'telefone' },
};

export function applyUserListFilters(
  queryBuilder: SelectQueryBuilder<User>,
  filters: UserListFilters,
): void {
  const { pageMeta, search } = filters;

  if (search) {
    queryBuilder.andWhere(
      '(user.nome ILIKE :search OR user.nome ILIKE :search OR user.email ILIKE :search OR user.telefone ILIKE :search)',
      { search: `%${search}%` },
    );
  }

  const sortField = resolveSortField(pageMeta.sort, sortFieldMap, {
    field: 'nome',
  });
  applyOrderBy(queryBuilder, 'user', sortField, pageMeta.order);
  applyPagination(queryBuilder, pageMeta.page, pageMeta.limit);
}
