import { SelectQueryBuilder } from 'typeorm';
import { Cliente } from './entities/cliente.entity';
import { PageMeta } from '../../shared/interfaces/page-meta.interface';
import {
  applyOrderBy,
  applyPagination,
  resolveSortField,
} from '../../shared/utils/query/query-builder.util';
import {
  formatDate,
  parseDateRange,
} from '../../shared/utils/query/date-range.util';
import { parseBooleanQuery } from '../../shared/utils/query/boolean-query.util';

export type ClienteListFilters = {
  pageMeta: PageMeta;
  search?: string;
  createdAtFrom?: string;
  createdAtTo?: string;
  pessoaJuridica?: string;
  ativo?: string;
};

const sortFieldMap = {
  nome: { field: 'nome' },
  documento: { field: 'documento' },
  pessoaJuridica: { field: 'pessoaJuridica' },
  telefone: { field: 'telefone' },
  email: { field: 'email' },
  createdAt: { field: 'createdAt' },
  ativo: { field: 'ativo' },
};

export function applyClienteListFilters(
  queryBuilder: SelectQueryBuilder<Cliente>,
  filters: ClienteListFilters,
): void {
  const {
    pageMeta,
    search,
    createdAtFrom,
    createdAtTo,
    pessoaJuridica,
    ativo,
  } = filters;

  applySearch(queryBuilder, search);
  applyCreatedAtFilters(queryBuilder, createdAtFrom, createdAtTo);
  applyPessoaJuridicaFilter(queryBuilder, pessoaJuridica);
  applyAtivoFilter(queryBuilder, ativo);

  const sortField = resolveSortField(pageMeta.sort, sortFieldMap, {
    field: 'createdAt',
  });
  applyOrderBy(queryBuilder, 'cliente', sortField, pageMeta.order);
  applyPagination(queryBuilder, pageMeta.page, pageMeta.limit);
}

function applySearch(
  queryBuilder: SelectQueryBuilder<Cliente>,
  search?: string,
): void {
  if (!search) return;

  const range = parseDateRange(search);
  if (range) {
    queryBuilder.andWhere(
      'cliente.createdAt >= :startDate AND cliente.createdAt <= :endDate',
      range,
    );
    return;
  }

  queryBuilder.andWhere(
    '(cliente.nome ILIKE :search OR cliente.documento ILIKE :search OR cliente.email ILIKE :search)',
    { search: `%${search}%` },
  );
}

function applyCreatedAtFilters(
  queryBuilder: SelectQueryBuilder<Cliente>,
  createdAtFrom?: string,
  createdAtTo?: string,
): void {
  const fromRange = createdAtFrom ? parseDateRange(createdAtFrom) : null;
  if (fromRange) {
    queryBuilder.andWhere('cliente.createdAt >= :startDate', {
      startDate: fromRange.startDate,
    });
  }

  const toRange = createdAtTo ? parseDateRange(createdAtTo) : null;
  if (toRange) {
    queryBuilder.andWhere('cliente.createdAt <= :endDate', {
      endDate: toRange.endDate,
    });
  } else if (createdAtFrom && !createdAtTo) {
    const today = formatDate(new Date());
    queryBuilder.andWhere('cliente.createdAt <= :endDate', {
      endDate: `${today} 23:59:59.999`,
    });
  }
}

function applyPessoaJuridicaFilter(
  queryBuilder: SelectQueryBuilder<Cliente>,
  pessoaJuridica?: string,
): void {
  const pessoaJuridicaValue = parseBooleanQuery(pessoaJuridica);
  if (pessoaJuridicaValue === null) return;

  queryBuilder.andWhere('cliente.pessoaJuridica = :pessoaJuridica', {
    pessoaJuridica: pessoaJuridicaValue,
  });
}

function applyAtivoFilter(
  queryBuilder: SelectQueryBuilder<Cliente>,
  ativo?: string,
): void {
  const ativoValue = parseBooleanQuery(ativo);
  if (ativoValue === null) return;

  queryBuilder.andWhere('cliente.ativo = :ativo', {
    ativo: ativoValue,
  });
}
