import { SelectQueryBuilder } from 'typeorm';
import { Alocacao } from './entities/alocacao.entity';
import { PageMeta } from '../../shared/interfaces/page-meta.interface';

export type AlocacaoListFilters = {
  pageMeta: PageMeta;
  search?: string;
  dataHoraInicio?: string;
  dataHoraFim?: string;
  funcionarioId?: number;
  clienteId?: number;
  ft?: boolean;
};

type SortFieldConfig = { field: string; isRelation: boolean };

const sortFieldMap: Record<string, SortFieldConfig> = {
  dataHoraInicio: { field: 'data_hora_inicio', isRelation: false },
  dataHoraFim: { field: 'data_hora_fim', isRelation: false },
  funcionarioNome: { field: 'funcionario.nome', isRelation: true },
  clienteNome: { field: 'cliente.nome', isRelation: true },
  createdAt: { field: 'createdAt', isRelation: false },
};

export function applyAlocacaoListFilters(
  queryBuilder: SelectQueryBuilder<Alocacao>,
  filters: AlocacaoListFilters,
): void {
  const {
    pageMeta,
    search,
    dataHoraInicio,
    dataHoraFim,
    funcionarioId,
    clienteId,
    ft,
  } = filters;

  queryBuilder.leftJoin('alocacao.servico', 'servico');
  queryBuilder.leftJoin('alocacao.funcionario', 'funcionario');
  queryBuilder.leftJoin('servico.cliente', 'cliente');

  queryBuilder.addSelect([
    'servico.descricao',
    'funcionario.nome',
    'cliente.nome',
  ]);

  applySearch(queryBuilder, search);
  applyDataHoraFilters(queryBuilder, dataHoraInicio, dataHoraFim);
  applyFuncionarioIdFilter(queryBuilder, funcionarioId);
  applyClienteIdFilter(queryBuilder, clienteId);
  applyFtFilter(queryBuilder, ft);

  const { field, isRelation } = resolveSortField(pageMeta.sort);
  queryBuilder.orderBy(
    isRelation ? field : `alocacao.${field}`,
    pageMeta.order,
  );

  const skip = (pageMeta.page - 1) * pageMeta.limit;
  queryBuilder.skip(skip).take(pageMeta.limit);
}

function applySearch(
  queryBuilder: SelectQueryBuilder<Alocacao>,
  search?: string,
): void {
  if (!search) return;

  const range = parseDateRange(search);
  if (range) {
    queryBuilder.andWhere(
      'alocacao.createdAt >= :startDate AND alocacao.createdAt <= :endDate',
      range,
    );
    return;
  }

  queryBuilder.andWhere(
    '(servico.descricao ILIKE :search OR cliente.nome ILIKE :search OR funcionario.nome ILIKE :search)',
    { search: `%${search}%` },
  );
}

function applyDataHoraFilters(
  queryBuilder: SelectQueryBuilder<Alocacao>,
  dataHoraInicio?: string,
  dataHoraFim?: string,
): void {
  const fromRange = dataHoraInicio ? parseDateRange(dataHoraInicio) : null;
  if (fromRange) {
    queryBuilder.andWhere('alocacao.data_hora_inicio >= :fromDate', {
      fromDate: fromRange.startDate,
    });
  }

  const toRange = dataHoraFim ? parseDateRange(dataHoraFim) : null;
  if (toRange) {
    queryBuilder.andWhere('alocacao.data_hora_inicio <= :toDate', {
      toDate: toRange.endDate,
    });
  }
}

function applyFuncionarioIdFilter(
  queryBuilder: SelectQueryBuilder<Alocacao>,
  funcionarioId?: number,
): void {
  if (funcionarioId == null) return;

  queryBuilder.andWhere('alocacao.funcionarioId = :funcionarioId', {
    funcionarioId,
  });
}

function applyClienteIdFilter(
  queryBuilder: SelectQueryBuilder<Alocacao>,
  clienteId?: number,
): void {
  if (clienteId == null) return;

  queryBuilder.andWhere('servico.clienteId = :clienteId', {
    clienteId,
  });
}

function applyFtFilter(
  queryBuilder: SelectQueryBuilder<Alocacao>,
  ft?: boolean,
): void {
  if (ft == null) return;

  queryBuilder.andWhere('alocacao.ft = :ft', { ft });
}

function parseDateRange(
  input: string,
): { startDate: string; endDate: string } | null {
  const match = input.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
  if (!match) return null;

  const [, day, month, year] = match;
  const base = `${year}-${month}-${day}`;
  return {
    startDate: `${base} 00:00:00`,
    endDate: `${base} 23:59:59.999`,
  };
}

function resolveSortField(sort?: string): SortFieldConfig {
  return sortFieldMap[sort ?? ''] ?? { field: 'createdAt', isRelation: false };
}
