import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  UseGuards,
  HttpStatus,
  HttpCode,
  Query,
} from '@nestjs/common';
import { AlocacaoService } from './alocacao.service';
import { CreateAlocacaoDto } from './dto/create-alocacao.dto';
import { UpdateAlocacaoDto } from './dto/update-alocacao.dto';
import { ApiResponse } from '../../shared/dto/api-response.dto';
import { AlocacaoResponseDto } from './dto/alocacao-response.dto';
import { plainToInstance } from 'class-transformer';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { Roles } from '../../shared/utils/decorators/roles.decorator';
import { Role } from '../../shared/enums/role.enum';
import { AlocacaoListQueryDto } from './dto/alocacao-list-query.dto';

@Controller('alocacao')
@UseGuards(JwtAuthGuard, RolesGuard)
export class AlocacaoController {
  constructor(private readonly alocacaoService: AlocacaoService) {}

  @Post()
  @Roles(Role.ADMIN)
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createAlocacaoDto: CreateAlocacaoDto) {
    const response = await this.alocacaoService.create(createAlocacaoDto);
    return ApiResponse.success('Alocação criada  com sucesso', response);
  }

  @Get()
  @Roles(Role.USER)
  @HttpCode(HttpStatus.OK)
  async findAll(@Query() query: AlocacaoListQueryDto) {
    const pageMeta = query.toPageMeta();

    const response = await this.alocacaoService.findAll(
      pageMeta,
      query.search,
      query.dataHoraInicio,
      query.dataHoraFim,
      query.funcionarioId ? parseInt(query.funcionarioId) : undefined,
      query.clienteId ? parseInt(query.clienteId) : undefined,
      query.ft ?? undefined,
    );

    return ApiResponse.success('Alocações obtidas com sucesso', response);
  }

  @Get(':id')
  @Roles(Role.USER)
  @HttpCode(HttpStatus.OK)
  async findOne(@Param('id') id: string) {
    const alocacao = await this.alocacaoService.findOne(+id);
    const response = plainToInstance(AlocacaoResponseDto, alocacao);
    return ApiResponse.success('Alocação encontrada com sucesso', response);
  }

  @Put(':id')
  @Roles(Role.ADMIN)
  @HttpCode(HttpStatus.OK)
  async update(
    @Param('id') id: string,
    @Body() updateAlocacaoDto: UpdateAlocacaoDto,
  ) {
    const response = await this.alocacaoService.update(+id, updateAlocacaoDto);
    return ApiResponse.success('Alocação atualizada com sucesso', response);
  }

  @Delete(':id')
  @Roles(Role.ADMIN)
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string) {
    await this.alocacaoService.remove(+id);
    return ApiResponse.success('Alocação removida com sucesso');
  }
}
