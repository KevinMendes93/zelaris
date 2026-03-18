import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Funcionario } from './entities/funcionario.entity';
import { CreateFuncionarioDto } from './dto/create-funcionario.dto';
import { UpdateFuncionarioDto } from './dto/update-funcionario.dto';
import { PaginatedResponse } from '../../shared/dto/paginated-response.dto';
import { PageMeta } from '../../shared/interfaces/page-meta.interface';
import { FuncionarioValidators } from './funcionario.validators';
import { FuncaoValidators } from '../funcao/funcao.validators';
import { ContaBancaria } from '../conta-bancaria/entities/conta-bancaria.entity';
import { ValeTransporte } from '../vale-transporte/vale-transporte.entity';
import {
  applyAlocacaoFilters,
  applyFuncionarioListFilters,
} from './funcionario.filters';
import { FuncionarioResponseDto } from './dto/funcionario-response.dto';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class FuncionarioService {
  constructor(
    @InjectRepository(Funcionario)
    private readonly funcionarioRepository: Repository<Funcionario>,
    @InjectRepository(ContaBancaria)
    private readonly contaBancariaRepository: Repository<ContaBancaria>,
    @InjectRepository(ValeTransporte)
    private readonly valeTransporteRepository: Repository<ValeTransporte>,
    private readonly funcionarioValidators: FuncionarioValidators,
    private readonly funcaoValidators: FuncaoValidators,
  ) {}

  async create(
    createFuncionarioDto: CreateFuncionarioDto,
  ): Promise<FuncionarioResponseDto> {
    await this.funcionarioValidators.validate(createFuncionarioDto);

    const funcao =
      await this.funcaoValidators.validadeFuncaoBelongsToCurrentYearOnCreate(
        createFuncionarioDto.funcaoId,
      );

    const telefone = this.normalizeTelefone(createFuncionarioDto.telefone);
    const recado = createFuncionarioDto.recado
      ? this.normalizeTelefone(createFuncionarioDto.recado)
      : undefined;

    const funcionario = this.funcionarioRepository.create({
      ...createFuncionarioDto,
      funcao,
      telefone,
      recado,
    });

    const response = await this.funcionarioRepository.save(funcionario);
    return plainToInstance(FuncionarioResponseDto, response);
  }

  async findAll(
    pageMeta: PageMeta,
    search?: string,
    createdAtFrom?: string,
    createdAtTo?: string,
    freelancer?: string,
    ativo?: string,
  ): Promise<PaginatedResponse<FuncionarioResponseDto>> {
    const queryBuilder =
      this.funcionarioRepository.createQueryBuilder('funcionario');

    applyFuncionarioListFilters(queryBuilder, {
      pageMeta,
      search,
      createdAtFrom,
      createdAtTo,
      freelancer,
      ativo,
    });

    const [items, total] = await queryBuilder.getManyAndCount();

    const paginatedResult = new PaginatedResponse(
      items,
      pageMeta.page,
      pageMeta.limit,
      total,
    );
    return {
      items: plainToInstance(FuncionarioResponseDto, items),
      meta: paginatedResult.meta,
    };
  }

  async findOne(id: number): Promise<Funcionario> {
    const funcionario = await this.funcionarioRepository.findOne({
      where: { id },
      relations: [
        'endereco',
        'funcao',
        'documentacao',
        'valeTransportes',
        'contaBancaria',
      ],
    });

    if (!funcionario) {
      throw new NotFoundException(`Funcionário com ID ${id} não encontrado`);
    }

    return funcionario;
  }

  async findToAlocacao(
    dataHoraInicio: string,
    dataHoraFim: string,
    isFt: boolean,
    excludeAlocacaoId?: number,
  ): Promise<FuncionarioResponseDto[]> {
    const inicio = new Date(dataHoraInicio);
    const fim = new Date(dataHoraFim);
    const dataAtual = new Date();

    let whereCondition =
      'alocacao.data_hora_inicio < :fim AND alocacao.data_hora_fim > :inicio';
    const params: Record<string, unknown> = { inicio, fim };

    if (excludeAlocacaoId) {
      whereCondition += ' AND alocacao.id != :excludeId';
      params.excludeId = excludeAlocacaoId;
    }

    const funcionarios = await this.funcionarioRepository
      .createQueryBuilder('funcionario')
      .leftJoin('funcionario.alocacoes', 'alocacao', whereCondition, params)
      .leftJoinAndSelect(
        'funcionario.alocacoes',
        'alocacoesFuturas',
        'alocacoesFuturas.data_hora_fim > :dataAtual',
        { dataAtual },
      )
      .where('alocacao.id IS NULL')
      .andWhere('funcionario.ativo = true')
      .orderBy('funcionario.nome', 'ASC')
      .getMany();

    const response = applyAlocacaoFilters(funcionarios, isFt, inicio, fim);

    return plainToInstance(FuncionarioResponseDto, response);
  }

  async update(
    id: number,
    updateFuncionarioDto: UpdateFuncionarioDto,
  ): Promise<FuncionarioResponseDto> {
    const funcionario = await this.findOne(id);

    await this.funcionarioValidators.validateUpdate(updateFuncionarioDto, id);
    await this.funcaoValidators.validateFuncaoBelongsToCurrentYearOnUpdate(
      updateFuncionarioDto,
    );
    this.normalizeUpdatedTelefones(updateFuncionarioDto);
    await this.removeChieldEntities(updateFuncionarioDto, funcionario);

    this.funcionarioRepository.merge(funcionario, updateFuncionarioDto);
    const response = await this.funcionarioRepository.save(funcionario);
    return plainToInstance(FuncionarioResponseDto, response);
  }

  async remove(id: number): Promise<void> {
    const funcionario = await this.findOne(id);
    await this.funcionarioRepository.remove(funcionario);
  }

  async toggleAtivo(id: number): Promise<FuncionarioResponseDto> {
    const funcionario = await this.findOne(id);
    funcionario.ativo = !funcionario.ativo;
    const response = await this.funcionarioRepository.save(funcionario);
    return plainToInstance(FuncionarioResponseDto, response);
  }

  private normalizeUpdatedTelefones(
    updateFuncionarioDto: UpdateFuncionarioDto,
  ): void {
    updateFuncionarioDto.telefone = updateFuncionarioDto.telefone
      ? this.normalizeTelefone(updateFuncionarioDto.telefone)
      : undefined;
    updateFuncionarioDto.recado = updateFuncionarioDto.recado
      ? this.normalizeTelefone(updateFuncionarioDto.recado)
      : undefined;
  }

  private normalizeTelefone(telefone: string): string {
    return telefone.replace(/\D/g, '');
  }

  private async removeChieldEntities(
    updateFuncionarioDto: UpdateFuncionarioDto,
    funcionario: Funcionario,
  ): Promise<void> {
    const shouldResetValeTransportes =
      updateFuncionarioDto.temValeTransporte === false ||
      updateFuncionarioDto.valeTransportes !== undefined;

    if (shouldResetValeTransportes) {
      await this.clearValeTransportes(funcionario);
    }

    if (
      updateFuncionarioDto.contaBancaria === null &&
      funcionario.contaBancaria
    ) {
      await this.contaBancariaRepository.delete(funcionario.contaBancaria.id);
      funcionario.contaBancaria = null;
    }
  }

  private async clearValeTransportes(funcionario: Funcionario): Promise<void> {
    if (funcionario.valeTransportes?.length) {
      await this.valeTransporteRepository.delete(
        funcionario.valeTransportes.map((valeTransporte) => valeTransporte.id),
      );
    }
    funcionario.valeTransportes = [];
  }
}
