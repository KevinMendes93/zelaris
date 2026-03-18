import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  HttpCode,
  HttpStatus,
  Query,
  Put,
  ParseIntPipe,
  Patch,
} from '@nestjs/common';
import { ServicoService } from './servico.service';
import { CreateServicoDto } from './dto/create-servico.dto';
import { UpdateServicoDto } from './dto/update-servico.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { Roles } from '../../shared/utils/decorators/roles.decorator';
import { Role } from '../../shared/enums/role.enum';
import { ApiResponse } from '../../shared/dto/api-response.dto';
import { ServicoResponseDto } from './dto/servico-response.dto';
import { plainToInstance } from 'class-transformer';
import { StatusServico } from '../../shared/enums/status-servico.enum';
import { ServicoListQueryDto } from './dto/servico-list-query.dto';

@Controller('servico')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ServicoController {
  constructor(private readonly servicoService: ServicoService) {}

  @Post()
  @Roles(Role.ADMIN)
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createServicoDto: CreateServicoDto) {
    const response = await this.servicoService.create(createServicoDto);
    return ApiResponse.success('Serviço criado com sucesso', response);
  }

  @Get()
  @Roles(Role.USER)
  @HttpCode(HttpStatus.OK)
  async findAll(@Query() query: ServicoListQueryDto) {
    const pageMeta = query.toPageMeta();

    const response = await this.servicoService.findAll(
      pageMeta,
      query.search,
      query.dataHoraInicio,
      query.dataHoraFim,
      query.status,
      query.clienteId ? parseInt(query.clienteId) : undefined,
    );
    return ApiResponse.success('Serviços obtidos com sucesso', response);
  }

  @Get(':id')
  @Roles(Role.USER)
  @HttpCode(HttpStatus.OK)
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const servico = await this.servicoService.findOne(id);
    const response = plainToInstance(ServicoResponseDto, servico);
    return ApiResponse.success('Serviço obtido com sucesso', response);
  }

  @Put(':id')
  @Roles(Role.ADMIN)
  @HttpCode(HttpStatus.OK)
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateServicoDto: UpdateServicoDto,
  ) {
    const response = await this.servicoService.update(id, updateServicoDto);
    return ApiResponse.success('Serviço atualizado com sucesso', response);
  }

  @Patch(':id/change-status')
  @Roles(Role.ADMIN)
  @HttpCode(HttpStatus.OK)
  async changeStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body('status') status: StatusServico,
  ) {
    const response = await this.servicoService.changeStatus(id, status);
    return ApiResponse.success('Status atualizado com sucesso', response);
  }

  @Delete(':id')
  @Roles(Role.ADMIN)
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id', ParseIntPipe) id: number) {
    await this.servicoService.remove(id);
    return ApiResponse.success('Serviço removido com sucesso');
  }
}
