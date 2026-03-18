import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Not, Repository } from 'typeorm';
import { Cliente } from './entities/cliente.entity';
import { CreateClienteDto } from './dto/create-cliente.dto';
import { UpdateClienteDto } from './dto/update-cliente.dto';

@Injectable()
export class ClienteValidators {
  constructor(
    @InjectRepository(Cliente)
    private readonly clienteRepository: Repository<Cliente>,
  ) {}

  async validateUniqueFields(
    createClienteDto: CreateClienteDto,
  ): Promise<void> {
    const documento = await this.clienteRepository.findOne({
      where: { documento: createClienteDto.documento },
    });
    if (documento) {
      throw new ConflictException('Documento já cadastrado para outro cliente');
    }
    const email = await this.clienteRepository.findOne({
      where: { email: createClienteDto.email },
    });
    if (email) {
      throw new ConflictException('Email já cadastrado para outro cliente');
    }
    const telefone = await this.clienteRepository.findOne({
      where: { telefone: createClienteDto.telefone },
    });
    if (telefone) {
      throw new ConflictException('Telefone já cadastrado para outro cliente');
    }
  }

  async validateUniqueFieldsForUpdate(
    clienteId: number,
    updateClienteDto: UpdateClienteDto,
  ): Promise<void> {
    const documento = await this.clienteRepository.findOne({
      where: { documento: updateClienteDto.documento, id: Not(clienteId) },
    });
    if (documento) {
      throw new ConflictException('Documento já cadastrado para outro cliente');
    }
    const email = await this.clienteRepository.findOne({
      where: { email: updateClienteDto.email, id: Not(clienteId) },
    });
    if (email) {
      throw new ConflictException('Email já cadastrado para outro cliente');
    }
    const telefone = await this.clienteRepository.findOne({
      where: { telefone: updateClienteDto.telefone, id: Not(clienteId) },
    });
    if (telefone) {
      throw new ConflictException('Telefone já cadastrado para outro cliente');
    }
  }
}
