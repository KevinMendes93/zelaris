import { BadRequestException, Injectable } from '@nestjs/common';
import { Alocacao } from './entities/alocacao.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { ModoTrabalho } from '../../shared/enums/modo-trabalho.enum';
import { Servico } from '../servico/entities/servico.entity';
import { Funcionario } from '../funcionario/entities/funcionario.entity';

export type AlocacaoPayload = {
  servicoId: number;
  funcionarioId: number;
  data_hora_inicio: string;
  data_hora_fim: string;
  ft: boolean;
};

@Injectable()
export class AlocacaoValidators {
  constructor(
    @InjectRepository(Alocacao)
    private readonly alocacaoRepository: Repository<Alocacao>,
  ) {}

  async validate(
    dto: AlocacaoPayload,
    servico: Servico,
    funcionario: Funcionario,
    excludeId?: number,
  ): Promise<void> {
    const inicio = new Date(dto.data_hora_inicio);
    const fim = new Date(dto.data_hora_fim);

    await this.verifyAlocacaoPeriodConflict(dto, inicio, fim, excludeId);
    this.verifyServicoPeriodConflict(servico, inicio, fim);

    if (funcionario.modoTrabalho === ModoTrabalho.CINCO_POR_DOIS && !dto.ft) {
      this.verifyWorkMode5x2Conflict(inicio, fim);
    }

    if (
      funcionario.modoTrabalho === ModoTrabalho.DOZE_POR_TRINTA_E_SEIS &&
      !dto.ft
    ) {
      await this.verifyWorkMode12x36Conflict(dto, inicio, fim, excludeId);
    }
  }
  private async verifyAlocacaoPeriodConflict(
    dto: AlocacaoPayload,
    inicio: Date,
    fim: Date,
    excludeId?: number,
  ): Promise<void> {
    let periodQuery = this.alocacaoRepository
      .createQueryBuilder('alocacao')
      .innerJoin('alocacao.funcionario', 'funcionario')
      .where('funcionario.id = :funcionarioId', {
        funcionarioId: dto.funcionarioId,
      })
      .andWhere('alocacao.data_hora_inicio < :fim', { fim })
      .andWhere('alocacao.data_hora_fim > :inicio', { inicio });

    if (excludeId) {
      periodQuery = periodQuery.andWhere('alocacao.id != :excludeId', {
        excludeId,
      });
    }

    const funcionarioPeriodConflict = await periodQuery.getOne();

    if (funcionarioPeriodConflict) {
      throw new BadRequestException(
        `O funcionário já possui uma alocação no período informado (conflito com alocação #${funcionarioPeriodConflict.id}).`,
      );
    }
  }
  private verifyServicoPeriodConflict(
    servico: Servico,
    inicio: Date,
    fim: Date,
  ): void {
    if (
      inicio < servico.data_hora_inicio ||
      (servico.data_hora_fim && inicio > servico.data_hora_fim) ||
      fim < servico.data_hora_inicio ||
      (servico.data_hora_fim && fim > servico.data_hora_fim)
    ) {
      throw new BadRequestException(
        'O período da alocação deve estar dentro do período do serviço.',
      );
    }
  }
  private verifyWorkMode5x2Conflict(inicio: Date, fim: Date): void {
    if (
      inicio.getDay() === 0 ||
      inicio.getDay() === 6 ||
      fim.getDay() === 0 ||
      fim.getDay() === 6
    ) {
      throw new BadRequestException(
        'Funcionário com modo de trabalho 5/2 não pode ser alocado em finais de semana.',
      );
    }
    if (inicio.getHours() < 6 || fim.getHours() > 18) {
      throw new BadRequestException(
        'Horário fora do intervalo permitido para modo de trabalho 5/2.',
      );
    }
  }
  private async verifyWorkMode12x36Conflict(
    dto: AlocacaoPayload,
    inicio: Date,
    fim: Date,
    excludeId?: number,
  ): Promise<void> {
    const TRINTA_SEIS_HORAS_MS = 36 * 60 * 60 * 1000;
    const janelaInicio = new Date(inicio.getTime() - TRINTA_SEIS_HORAS_MS);
    const janelaFim = new Date(fim.getTime() + TRINTA_SEIS_HORAS_MS);

    let periodQuery = this.alocacaoRepository
      .createQueryBuilder('alocacao')
      .innerJoin('alocacao.funcionario', 'funcionario')
      .where('funcionario.id = :funcionarioId', {
        funcionarioId: dto.funcionarioId,
      })
      .andWhere('alocacao.data_hora_inicio < :janelaFim', { janelaFim })
      .andWhere('alocacao.data_hora_fim > :janelaInicio', { janelaInicio });

    if (excludeId) {
      periodQuery = periodQuery.andWhere('alocacao.id != :excludeId', {
        excludeId,
      });
    }

    const conflict = await periodQuery.getOne();

    if (conflict) {
      throw new BadRequestException(
        `Funcionário com escala 12x36 precisa de 36 horas de descanso entre alocações (conflito com alocação #${conflict.id}).`,
      );
    }
  }
}
