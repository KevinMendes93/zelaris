import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PaginatedResponse } from '../../shared/dto/paginated-response.dto';
import { PageMeta } from '../../shared/interfaces/page-meta.interface';
import { Cliente } from './entities/cliente.entity';
import { CreateClienteDto } from './dto/create-cliente.dto';
import { UpdateClienteDto } from './dto/update-cliente.dto';
import { applyClienteListFilters } from './cliente.filters';
import { ClienteResponseDto } from './dto/cliente-response.dto';
import { plainToInstance } from 'class-transformer';
import { ClienteValidators } from './cliente.validators';

@Injectable()
export class ClienteService {
  constructor(
    @InjectRepository(Cliente)
    private readonly clienteRepository: Repository<Cliente>,
    private readonly clienteValidators: ClienteValidators,
  ) {}

  async create(
    createClienteDto: CreateClienteDto,
  ): Promise<ClienteResponseDto> {
    await this.clienteValidators.validateUniqueFields(createClienteDto);
    const telefone = this.normalizeTelefone(createClienteDto.telefone);
    const cliente = this.clienteRepository.create({
      ...createClienteDto,
      telefone,
    });

    const response = await this.clienteRepository.save(cliente);
    return plainToInstance(ClienteResponseDto, response);
  }

  async findAll(
    pageMeta: PageMeta,
    search?: string,
    createdAtFrom?: string,
    createdAtTo?: string,
    pessoaJuridica?: string,
    ativo?: string,
  ): Promise<PaginatedResponse<ClienteResponseDto>> {
    const queryBuilder = this.clienteRepository.createQueryBuilder('cliente');

    applyClienteListFilters(queryBuilder, {
      pageMeta,
      search,
      createdAtFrom,
      createdAtTo,
      pessoaJuridica,
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
      items: plainToInstance(ClienteResponseDto, items),
      meta: paginatedResult.meta,
    };
  }

  async findOne(id: number): Promise<Cliente> {
    const cliente = await this.clienteRepository.findOne({
      where: { id },
      relations: ['endereco'],
    });

    if (!cliente) {
      throw new NotFoundException(`Cliente com ID ${id} não encontrado`);
    }

    return cliente;
  }

  async update(
    id: number,
    updateClienteDto: UpdateClienteDto,
  ): Promise<ClienteResponseDto> {
    const cliente = await this.clienteRepository.findOne({
      where: { id },
      relations: ['endereco'],
    });

    await this.clienteValidators.validateUniqueFieldsForUpdate(
      id,
      updateClienteDto,
    );

    this.normalizeUpdatedTelefones(updateClienteDto);

    this.clienteRepository.merge(cliente!, updateClienteDto);

    const response = await this.clienteRepository.save(cliente!);
    return plainToInstance(ClienteResponseDto, response);
  }

  async remove(id: number): Promise<void> {
    const cliente = await this.findOne(id);
    await this.clienteRepository.remove(cliente);
  }

  async toggleAtivo(id: number): Promise<ClienteResponseDto> {
    const cliente = await this.findOne(id);
    cliente.ativo = !cliente.ativo;
    const response = await this.clienteRepository.save(cliente);
    return plainToInstance(ClienteResponseDto, response);
  }

  private normalizeUpdatedTelefones(updateClienteDto: UpdateClienteDto): void {
    if (updateClienteDto.telefone) {
      updateClienteDto.telefone = this.normalizeTelefone(
        updateClienteDto.telefone,
      );
    }
  }

  private normalizeTelefone(telefone: string): string {
    return telefone.replace(/\D/g, '');
  }
}
