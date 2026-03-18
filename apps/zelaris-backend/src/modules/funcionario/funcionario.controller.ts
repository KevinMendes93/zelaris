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
import { FuncionarioService } from './funcionario.service';
import { CreateFuncionarioDto } from './dto/create-funcionario.dto';
import { UpdateFuncionarioDto } from './dto/update-funcionario.dto';
import { FuncionarioResponseDto } from './dto/funcionario-response.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { Roles } from '../../shared/utils/decorators/roles.decorator';
import { Role } from '../../shared/enums/role.enum';
import { plainToInstance } from 'class-transformer';
import { ApiResponse } from '../../shared/dto/api-response.dto';
import { FuncionarioListQueryDto } from './dto/funcionario-list-query.dto';

@Controller('funcionarios')
@UseGuards(JwtAuthGuard, RolesGuard)
export class FuncionarioController {
  constructor(private readonly funcionarioService: FuncionarioService) {}

  @Post()
  @Roles(Role.ADMIN)
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createFuncionarioDto: CreateFuncionarioDto) {
    const response = await this.funcionarioService.create(createFuncionarioDto);
    return ApiResponse.success('Funcionário criado com sucesso', response);
  }

  @Get()
  @Roles(Role.USER)
  @HttpCode(HttpStatus.OK)
  async findAll(@Query() query: FuncionarioListQueryDto) {
    const pageMeta = query.toPageMeta();

    const response = await this.funcionarioService.findAll(
      pageMeta,
      query.search,
      query.createdAtFrom,
      query.createdAtTo,
      query.freelancer,
      query.ativo,
    );
    return ApiResponse.success('Funcionários obtidos com sucesso', response);
  }

  @Get('to-alocacao')
  @Roles(Role.ADMIN)
  @HttpCode(HttpStatus.OK)
  async findToAlocacao(
    @Query('dataHoraInicio') dataHoraInicio: string,
    @Query('dataHoraFim') dataHoraFim: string,
    @Query('isFt') isFt: boolean,
    @Query('excludeAlocacaoId') excludeAlocacaoId?: string,
  ) {
    const response = await this.funcionarioService.findToAlocacao(
      dataHoraInicio,
      dataHoraFim,
      isFt,
      excludeAlocacaoId ? parseInt(excludeAlocacaoId) : undefined,
    );
    return ApiResponse.success('Funcionários obtidos com sucesso', response);
  }

  @Get(':id')
  @Roles(Role.USER)
  @HttpCode(HttpStatus.OK)
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const funcionario = await this.funcionarioService.findOne(id);
    const response = plainToInstance(FuncionarioResponseDto, funcionario);
    return ApiResponse.success('Funcionário obtido com sucesso', response);
  }

  @Put(':id')
  @Roles(Role.ADMIN)
  @HttpCode(HttpStatus.OK)
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateFuncionarioDto: UpdateFuncionarioDto,
  ) {
    const response = await this.funcionarioService.update(
      id,
      updateFuncionarioDto,
    );
    return ApiResponse.success('Funcionário atualizado com sucesso', response);
  }

  @Patch(':id/toggle-ativo')
  @Roles(Role.ADMIN)
  @HttpCode(HttpStatus.OK)
  async toggleAtivo(@Param('id', ParseIntPipe) id: number) {
    const response = await this.funcionarioService.toggleAtivo(id);
    return ApiResponse.success(
      `Funcionário ${response.ativo ? 'ativado' : 'desativado'} com sucesso`,
      response,
    );
  }

  @Delete(':id')
  @Roles(Role.ADMIN)
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id', ParseIntPipe) id: number) {
    await this.funcionarioService.remove(id);
    return ApiResponse.success('Funcionário removido com sucesso');
  }
}
