import { SelectQueryBuilder } from 'typeorm';
import { Funcao } from './entities/funcao.entity';
import { PageMeta } from '../../shared/interfaces/page-meta.interface';
import { TipoPagamento } from '../../shared/enums/tipo-pagamento.enum';
import {
  applyOrderBy,
  applyPagination,
  resolveSortField,
} from '../../shared/utils/query/query-builder.util';

export type FuncaoListFilters = {
  pageMeta: PageMeta;
  ano?: number;
  tipoPagamento?: TipoPagamento;
  search?: string;
};

const sortFieldMap = {
  nome: { field: 'nome' },
  salario: { field: 'salario' },
  anoVigente: { field: 'anoVigente' },
};

export function applyFuncaoListFilters(
  queryBuilder: SelectQueryBuilder<Funcao>,
  filters: FuncaoListFilters,
): void {
  const { pageMeta, ano, tipoPagamento, search } = filters;

  if (ano) {
    queryBuilder.andWhere('funcao.anoVigente = :ano', { ano });
  }

  if (tipoPagamento) {
    queryBuilder.andWhere('funcao.tipoPagamento = :tipoPagamento', {
      tipoPagamento,
    });
  }

  if (search) {
    queryBuilder.andWhere(
      '(funcao.nome ILIKE :search OR CAST(funcao.salario AS TEXT) ILIKE :search OR CAST(funcao.anoVigente AS TEXT) ILIKE :search)',
      { search: `%${search}%` },
    );
  }

  const sortField = resolveSortField(pageMeta.sort, sortFieldMap, {
    field: 'anoVigente',
  });
  applyOrderBy(queryBuilder, 'funcao', sortField, pageMeta.order);
  applyPagination(queryBuilder, pageMeta.page, pageMeta.limit);
}
