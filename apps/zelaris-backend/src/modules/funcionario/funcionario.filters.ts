import { SelectQueryBuilder } from 'typeorm';
import { Funcionario } from './entities/funcionario.entity';
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
import { ModoTrabalho } from '../../shared/enums/modo-trabalho.enum';

export type FuncionarioListFilters = {
  pageMeta: PageMeta;
  search?: string;
  createdAtFrom?: string;
  createdAtTo?: string;
  freelancer?: string;
  ativo?: string;
};

const sortFieldMap = {
  nome: { field: 'nome' },
  cpf: { field: 'cpf' },
  dataNascimento: { field: 'dataNascimento' },
  freelancer: { field: 'freelancer' },
  createdAt: { field: 'createdAt' },
  telefone: { field: 'telefone' },
  email: { field: 'email' },
  ativo: { field: 'ativo' },
};

export function applyFuncionarioListFilters(
  queryBuilder: SelectQueryBuilder<Funcionario>,
  filters: FuncionarioListFilters,
): void {
  const { pageMeta, search, createdAtFrom, createdAtTo, freelancer, ativo } =
    filters;

  applySearch(queryBuilder, search);
  applyCreatedAtFilters(queryBuilder, createdAtFrom, createdAtTo);
  applyFreelancerFilter(queryBuilder, freelancer);
  applyAtivoFilter(queryBuilder, ativo);

  const sortField = resolveSortField(pageMeta.sort, sortFieldMap, {
    field: 'createdAt',
  });
  applyOrderBy(queryBuilder, 'funcionario', sortField, pageMeta.order);
  applyPagination(queryBuilder, pageMeta.page, pageMeta.limit);
}

function applySearch(
  queryBuilder: SelectQueryBuilder<Funcionario>,
  search?: string,
): void {
  if (!search) return;

  const range = parseDateRange(search);
  if (range) {
    queryBuilder.andWhere(
      'funcionario.createdAt >= :startDate AND funcionario.createdAt <= :endDate',
      range,
    );
    return;
  }

  queryBuilder.andWhere(
    '(funcionario.nome ILIKE :search OR funcionario.cpf ILIKE :search OR funcionario.telefone ILIKE :search OR funcionario.email ILIKE :search)',
    { search: `%${search}%` },
  );
  queryBuilder.leftJoin('funcionario.documentacao', 'doc_search');
}

function applyCreatedAtFilters(
  queryBuilder: SelectQueryBuilder<Funcionario>,
  createdAtFrom?: string,
  createdAtTo?: string,
): void {
  const fromRange = createdAtFrom ? parseDateRange(createdAtFrom) : null;
  if (fromRange) {
    queryBuilder.andWhere('funcionario.createdAt >= :startDate', {
      startDate: fromRange.startDate,
    });
  }

  const toRange = createdAtTo ? parseDateRange(createdAtTo) : null;
  if (toRange) {
    queryBuilder.andWhere('funcionario.createdAt <= :endDate', {
      endDate: toRange.endDate,
    });
  } else if (createdAtFrom && !createdAtTo) {
    const today = formatDate(new Date());
    queryBuilder.andWhere('funcionario.createdAt <= :endDate', {
      endDate: `${today} 23:59:59.999`,
    });
  }
}

function applyFreelancerFilter(
  queryBuilder: SelectQueryBuilder<Funcionario>,
  freelancer?: string,
): void {
  const freelancerValue = parseBooleanQuery(freelancer);
  if (freelancerValue === null) return;

  queryBuilder.andWhere('funcionario.freelancer = :freelancer', {
    freelancer: freelancerValue,
  });
}

function applyAtivoFilter(
  queryBuilder: SelectQueryBuilder<Funcionario>,
  ativo?: string,
): void {
  const ativoValue = parseBooleanQuery(ativo);
  if (ativoValue === null) return;

  queryBuilder.andWhere('funcionario.ativo = :ativo', {
    ativo: ativoValue,
  });
}

export function applyAlocacaoFilters(
  funcionariosResponse: Funcionario[],
  isFt: boolean,
  inicio: Date,
  fim: Date,
): Funcionario[] {
  const isWeekend = (date: Date) => date.getDay() === 0 || date.getDay() === 6;
  const isOutOfWorkHours = (date: Date) =>
    date.getHours() < 6 || date.getHours() > 18;
  const DOZE_HORAS_MS = 12 * 60 * 60 * 1000;

  const response = funcionariosResponse.filter((funcionario) => {
    if (isFt) return true;
    if (funcionario.modoTrabalho === ModoTrabalho.CINCO_POR_DOIS) {
      return (
        !isWeekend(inicio) &&
        !isWeekend(fim) &&
        !isOutOfWorkHours(inicio) &&
        !isOutOfWorkHours(fim)
      );
    }
    if (funcionario.modoTrabalho === ModoTrabalho.DOZE_POR_TRINTA_E_SEIS) {
      return funcionario.alocacoes.every(
        (alocacao) =>
          alocacao.data_hora_fim.getTime() <=
            inicio.getTime() - DOZE_HORAS_MS ||
          alocacao.data_hora_inicio.getTime() >= fim.getTime() + DOZE_HORAS_MS,
      );
    }
    return true;
  });

  return response;
}
