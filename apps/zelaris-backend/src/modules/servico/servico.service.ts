import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateServicoDto } from './dto/create-servico.dto';
import { UpdateServicoDto } from './dto/update-servico.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Servico } from './entities/servico.entity';
import { PageMeta } from '../../shared/interfaces/page-meta.interface';
import { PaginatedResponse } from '../../shared/dto/paginated-response.dto';
import { Cliente } from '../cliente/entities/cliente.entity';
import { StatusServico } from '../../shared/enums/status-servico.enum';
import { applyServicoListFilters } from './servico.filters';
import { ServicoResponseDto } from './dto/servico-response.dto';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class ServicoService {
  constructor(
    @InjectRepository(Servico)
    private readonly servicoRepository: Repository<Servico>,
    @InjectRepository(Cliente)
    private readonly clienteRepository: Repository<Cliente>,
  ) {}

  async create(
    createServicoDto: CreateServicoDto,
  ): Promise<ServicoResponseDto> {
    const cliente = await this.clienteRepository.findOne({
      where: { id: createServicoDto.clienteId },
    });
    const servico = this.servicoRepository.create({
      ...createServicoDto,
      cliente: cliente!,
    });
    const response = await this.servicoRepository.save(servico);
    return plainToInstance(ServicoResponseDto, response);
  }

  async findAll(
    pageMeta: PageMeta,
    search?: string,
    dataHoraInicio?: string,
    dataHoraFim?: string,
    status?: string,
    clienteId?: number,
  ): Promise<PaginatedResponse<ServicoResponseDto>> {
    const queryBuilder = this.servicoRepository.createQueryBuilder('servico');

    applyServicoListFilters(queryBuilder, {
      pageMeta,
      search,
      dataHoraInicio,
      dataHoraFim,
      status,
      clienteId,
    });

    const [items, total] = await queryBuilder.getManyAndCount();

    const paginatedResult = new PaginatedResponse(
      items,
      pageMeta.page,
      pageMeta.limit,
      total,
    );
    return {
      items: plainToInstance(ServicoResponseDto, items),
      meta: paginatedResult.meta,
    };
  }

  async findOne(id: number): Promise<Servico> {
    const servico = await this.servicoRepository.findOne({
      where: { id },
      relations: ['cliente'],
    });

    if (!servico) {
      throw new NotFoundException(`Serviço com ID ${id} não encontrado`);
    }

    return servico;
  }

  async update(
    id: number,
    updateServicoDto: UpdateServicoDto,
  ): Promise<ServicoResponseDto> {
    const servico = await this.findOne(id);

    const cliente = await this.clienteRepository.findOne({
      where: { id: updateServicoDto.clienteId },
    });

    this.servicoRepository.merge(servico, {
      ...updateServicoDto,
      cliente: cliente!,
    });

    const response = await this.servicoRepository.save(servico);
    return plainToInstance(ServicoResponseDto, response);
  }

  async changeStatus(
    id: number,
    status: StatusServico,
  ): Promise<ServicoResponseDto> {
    const servico = await this.findOne(id);
    servico.status = status;
    const response = await this.servicoRepository.save(servico);
    return plainToInstance(ServicoResponseDto, response);
  }

  async remove(id: number): Promise<void> {
    const servico = await this.findOne(id);
    await this.servicoRepository.remove(servico);
  }
}
