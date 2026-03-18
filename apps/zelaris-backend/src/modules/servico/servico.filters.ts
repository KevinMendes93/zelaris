import { SelectQueryBuilder } from 'typeorm';
import { Servico } from './entities/servico.entity';
import { PageMeta } from '../../shared/interfaces/page-meta.interface';
import {
  applyOrderBy,
  applyPagination,
  resolveSortField,
  SortFieldConfig,
} from '../../shared/utils/query/query-builder.util';
import { parseDateRange } from '../../shared/utils/query/date-range.util';

export type ServicoListFilters = {
  pageMeta: PageMeta;
  search?: string;
  dataHoraInicio?: string;
  dataHoraFim?: string;
  status?: string;
  clienteId?: number;
};

const sortFieldMap: Record<string, SortFieldConfig> = {
  descricao: { field: 'descricao', isRelation: false },
  dataHoraInicio: { field: 'data_hora_inicio', isRelation: false },
  dataHoraFim: { field: 'data_hora_fim', isRelation: false },
  valor: { field: 'valor', isRelation: false },
  clienteNome: { field: 'cliente.nome', isRelation: true },
  createdAt: { field: 'createdAt', isRelation: false },
};

export function applyServicoListFilters(
  queryBuilder: SelectQueryBuilder<Servico>,
  filters: ServicoListFilters,
): void {
  const { pageMeta, search, dataHoraInicio, dataHoraFim, status, clienteId } =
    filters;

  queryBuilder.leftJoinAndSelect('servico.cliente', 'cliente');

  applySearch(queryBuilder, search);
  applyDataHoraFilters(queryBuilder, dataHoraInicio, dataHoraFim);
  applyStatusFilter(queryBuilder, status);
  applyClienteIdFilter(queryBuilder, clienteId);

  const sortField = resolveSortField(pageMeta.sort, sortFieldMap, {
    field: 'createdAt',
    isRelation: false,
  });
  applyOrderBy(queryBuilder, 'servico', sortField, pageMeta.order);
  applyPagination(queryBuilder, pageMeta.page, pageMeta.limit);
}

function applySearch(
  queryBuilder: SelectQueryBuilder<Servico>,
  search?: string,
): void {
  if (!search) return;

  const range = parseDateRange(search);
  if (range) {
    queryBuilder.andWhere(
      'servico.createdAt >= :startDate AND servico.createdAt <= :endDate',
      range,
    );
    return;
  }

  queryBuilder.andWhere(
    '(servico.descricao ILIKE :search OR cliente.nome ILIKE :search)',
    { search: `%${search}%` },
  );
}

function applyDataHoraFilters(
  queryBuilder: SelectQueryBuilder<Servico>,
  dataHoraInicio?: string,
  dataHoraFim?: string,
): void {
  const fromRange = dataHoraInicio ? parseDateRange(dataHoraInicio) : null;
  if (fromRange) {
    queryBuilder.andWhere('servico.data_hora_inicio >= :fromDate', {
      fromDate: fromRange.startDate,
    });
  }

  const toRange = dataHoraFim ? parseDateRange(dataHoraFim) : null;
  if (toRange) {
    queryBuilder.andWhere('servico.data_hora_inicio <= :toDate', {
      toDate: toRange.endDate,
    });
  }
}

function applyStatusFilter(
  queryBuilder: SelectQueryBuilder<Servico>,
  status?: string,
): void {
  if (status === undefined || status === '') return;

  const allStatus = status
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);

  queryBuilder.andWhere('servico.status IN (:...allStatus)', {
    allStatus,
  });
}

function applyClienteIdFilter(
  queryBuilder: SelectQueryBuilder<Servico>,
  clienteId?: number,
): void {
  if (clienteId === undefined || clienteId === null) return;

  queryBuilder.andWhere('servico.clienteId = :clienteId', {
    clienteId,
  });
}
