import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  ParseIntPipe,
  Query,
  HttpStatus,
  HttpCode,
  Put,
  Patch,
} from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { Roles } from '../../shared/utils/decorators/roles.decorator';
import { Role } from '../../shared/enums/role.enum';
import { plainToInstance } from 'class-transformer';
import { ApiResponse } from '../../shared/dto/api-response.dto';
import { ClienteService } from './cliente.service';
import { CreateClienteDto } from './dto/create-cliente.dto';
import { ClienteResponseDto } from './dto/cliente-response.dto';
import { UpdateClienteDto } from './dto/update-cliente.dto';
import { ClienteListQueryDto } from './dto/cliente-list-query.dto';

@Controller('clientes')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ClienteController {
  constructor(private readonly clienteService: ClienteService) {}

  @Post()
  @Roles(Role.ADMIN)
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createClienteDto: CreateClienteDto) {
    const response = await this.clienteService.create(createClienteDto);
    return ApiResponse.success('Cliente criado com sucesso', response);
  }

  @Get()
  @Roles(Role.USER)
  @HttpCode(HttpStatus.OK)
  async findAll(@Query() query: ClienteListQueryDto) {
    const pageMeta = query.toPageMeta();

    const response = await this.clienteService.findAll(
      pageMeta,
      query.search,
      query.createdAtFrom,
      query.createdAtTo,
      query.pessoaJuridica,
      query.ativo,
    );
    return ApiResponse.success('Clientes obtidos com sucesso', response);
  }

  @Get(':id')
  @Roles(Role.USER)
  @HttpCode(HttpStatus.OK)
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const cliente = await this.clienteService.findOne(id);
    const response = plainToInstance(ClienteResponseDto, cliente);
    return ApiResponse.success('Cliente obtido com sucesso', response);
  }

  @Put(':id')
  @Roles(Role.ADMIN)
  @HttpCode(HttpStatus.OK)
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateClienteDto: UpdateClienteDto,
  ) {
    const response = await this.clienteService.update(id, updateClienteDto);
    return ApiResponse.success('Cliente atualizado com sucesso', response);
  }

  @Delete(':id')
  @Roles(Role.ADMIN)
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id', ParseIntPipe) id: number) {
    await this.clienteService.remove(id);
    return ApiResponse.success('Cliente removido com sucesso');
  }

  @Patch(':id/toggle-ativo')
  @Roles(Role.ADMIN)
  @HttpCode(HttpStatus.OK)
  async toggleAtivo(@Param('id', ParseIntPipe) id: number) {
    const response = await this.clienteService.toggleAtivo(id);
    return ApiResponse.success(
      `Cliente ${response.ativo ? 'ativado' : 'desativado'} com sucesso`,
      response,
    );
  }
}
