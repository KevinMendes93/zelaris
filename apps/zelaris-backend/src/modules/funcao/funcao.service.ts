import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Funcao } from './entities/funcao.entity';
import { CreateFuncaoDto } from './dto/create-funcao.dto';
import { UpdateFuncaoDto } from './dto/update-funcao.dto';
import { PaginatedResponse } from '../../shared/dto/paginated-response.dto';
import { PageMeta } from '../../shared/interfaces/page-meta.interface';
import { TipoPagamento } from '../../shared/enums/tipo-pagamento.enum';
import { applyFuncaoListFilters } from './funcao.filters';
import { FuncaoResponseDto } from './dto/funcao-response.dto';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class FuncaoService {
  constructor(
    @InjectRepository(Funcao)
    private readonly funcaoRepository: Repository<Funcao>,
  ) {}

  async create(createFuncaoDto: CreateFuncaoDto): Promise<FuncaoResponseDto> {
    const funcao = this.funcaoRepository.create({
      ...createFuncaoDto,
    });
    const response = await this.funcaoRepository.save(funcao);
    return plainToInstance(FuncaoResponseDto, response);
  }

  async findAll(
    pageMeta: PageMeta,
    ano: number | undefined,
    tipoPagamento: TipoPagamento | undefined,
    search?: string,
  ): Promise<PaginatedResponse<FuncaoResponseDto>> {
    const queryBuilder = this.funcaoRepository.createQueryBuilder('funcao');

    applyFuncaoListFilters(queryBuilder, {
      pageMeta,
      ano,
      tipoPagamento,
      search,
    });

    const [items, total] = await queryBuilder.getManyAndCount();

    const paginatedResult = new PaginatedResponse(
      items,
      pageMeta.page,
      pageMeta.limit,
      total,
    );
    return {
      items: plainToInstance(FuncaoResponseDto, items),
      meta: paginatedResult.meta,
    };
  }

  async findOne(id: number): Promise<Funcao> {
    const funcao = await this.funcaoRepository.findOne({ where: { id } });
    if (!funcao) {
      throw new NotFoundException(`Função com ID ${id} não encontrada`);
    }
    return funcao;
  }

  async update(
    id: number,
    updateFuncaoDto: UpdateFuncaoDto,
  ): Promise<FuncaoResponseDto> {
    const funcao = await this.findOne(id);

    Object.assign(funcao, updateFuncaoDto);
    const response = await this.funcaoRepository.save(funcao);
    return plainToInstance(FuncaoResponseDto, response);
  }

  async remove(id: number): Promise<void> {
    const funcao = await this.findOne(id);
    await this.funcaoRepository.remove(funcao);
  }
}
