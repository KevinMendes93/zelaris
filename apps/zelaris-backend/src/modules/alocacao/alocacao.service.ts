import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateAlocacaoDto } from './dto/create-alocacao.dto';
import { UpdateAlocacaoDto } from './dto/update-alocacao.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Alocacao } from './entities/alocacao.entity';
import { Repository } from 'typeorm';
import { AlocacaoPayload, AlocacaoValidators } from './alocacao.validators';
import { PageMeta } from '../../shared/interfaces/page-meta.interface';
import { PaginatedResponse } from '../../shared/dto/paginated-response.dto';
import { ServicoService } from '../servico/servico.service';
import { FuncionarioService } from '../funcionario/funcionario.service';
import { applyAlocacaoListFilters } from './alocacao.filters';
import { plainToInstance } from 'class-transformer';
import { AlocacaoResponseDto } from './dto/alocacao-response.dto';

@Injectable()
export class AlocacaoService {
  constructor(
    @InjectRepository(Alocacao)
    private readonly alocacaoRepository: Repository<Alocacao>,
    private readonly alocacaoValidators: AlocacaoValidators,
    private readonly servicoService: ServicoService,
    private readonly funcionarioService: FuncionarioService,
  ) {}

  async create(
    createAlocacaoDto: CreateAlocacaoDto,
  ): Promise<AlocacaoResponseDto> {
    const servico = await this.servicoService.findOne(
      createAlocacaoDto.servicoId,
    );
    const funcionario = await this.funcionarioService.findOne(
      createAlocacaoDto.funcionarioId,
    );
    await this.alocacaoValidators.validate(
      createAlocacaoDto,
      servico,
      funcionario,
    );

    const alocacao = this.alocacaoRepository.create({
      ...createAlocacaoDto,
      servico,
      funcionario,
    });
    const response = await this.alocacaoRepository.save(alocacao);
    return plainToInstance(AlocacaoResponseDto, response);
  }

  async findAll(
    pageMeta: PageMeta,
    search?: string,
    dataHoraInicio?: string,
    dataHoraFim?: string,
    funcionarioId?: number,
    clienteId?: number,
    ft?: boolean,
  ): Promise<PaginatedResponse<AlocacaoResponseDto>> {
    const queryBuilder = this.alocacaoRepository.createQueryBuilder('alocacao');

    applyAlocacaoListFilters(queryBuilder, {
      pageMeta,
      search,
      dataHoraInicio,
      dataHoraFim,
      funcionarioId,
      clienteId,
      ft,
    });

    const [items, total] = await queryBuilder.getManyAndCount();

    const paginatedResult = new PaginatedResponse(
      items,
      pageMeta.page,
      pageMeta.limit,
      total,
    );

    return {
      items: plainToInstance(AlocacaoResponseDto, items),
      meta: paginatedResult.meta,
    };
  }

  async findOne(id: number): Promise<Alocacao> {
    const alocacao = await this.alocacaoRepository.findOne({
      where: { id },
      relations: ['servico', 'funcionario', 'servico.cliente'],
    });

    if (!alocacao) {
      throw new NotFoundException(`Alocação com ID ${id} não encontrada.`);
    }

    return alocacao;
  }

  async update(
    id: number,
    updateAlocacaoDto: UpdateAlocacaoDto,
  ): Promise<AlocacaoResponseDto> {
    const alocacao = await this.findOne(id);
    const payload = this.buildPayload(alocacao, updateAlocacaoDto);

    const servico = await this.servicoService.findOne(payload.servicoId);
    const funcionario = await this.funcionarioService.findOne(
      payload.funcionarioId,
    );
    await this.alocacaoValidators.validate(payload, servico, funcionario, id);

    Object.assign(alocacao, {
      ...updateAlocacaoDto,
      servico,
      funcionario,
    });
    const response = await this.alocacaoRepository.save(alocacao);
    return plainToInstance(AlocacaoResponseDto, response);
  }

  async remove(id: number): Promise<void> {
    const alocacao = await this.findOne(id);
    await this.alocacaoRepository.remove(alocacao);
  }

  private buildPayload(
    alocacao: Alocacao,
    dto: UpdateAlocacaoDto,
  ): AlocacaoPayload {
    return {
      servicoId: dto.servicoId ?? alocacao.servico.id,
      funcionarioId: dto.funcionarioId ?? alocacao.funcionario.id,
      data_hora_inicio:
        dto.data_hora_inicio ?? alocacao.data_hora_inicio.toISOString(),
      data_hora_fim: dto.data_hora_fim ?? alocacao.data_hora_fim.toISOString(),
      ft: dto.ft ?? alocacao.ft,
    };
  }
}
