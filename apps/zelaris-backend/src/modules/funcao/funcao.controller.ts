import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  ParseIntPipe,
  Query,
  HttpStatus,
  HttpCode,
} from '@nestjs/common';
import { FuncaoService } from './funcao.service';
import { CreateFuncaoDto } from './dto/create-funcao.dto';
import { UpdateFuncaoDto } from './dto/update-funcao.dto';
import { FuncaoResponseDto } from './dto/funcao-response.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { plainToInstance } from 'class-transformer';
import { ApiResponse } from '../../shared/dto/api-response.dto';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { Roles } from '../../shared/utils/decorators/roles.decorator';
import { Role } from '../../shared/enums/role.enum';
import { FuncaoListQueryDto } from './dto/funcao-list-query.dto';

@Controller('funcoes')
@UseGuards(JwtAuthGuard, RolesGuard)
export class FuncaoController {
  constructor(private readonly funcaoService: FuncaoService) {}

  @Post()
  @Roles(Role.ADMIN)
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createFuncaoDto: CreateFuncaoDto) {
    const response = await this.funcaoService.create(createFuncaoDto);
    return ApiResponse.success('Função criada com sucesso', response);
  }

  @Get()
  @Roles(Role.USER)
  @HttpCode(HttpStatus.OK)
  async findAll(@Query() query: FuncaoListQueryDto) {
    const pageMeta = query.toPageMeta();

    const response = await this.funcaoService.findAll(
      pageMeta,
      query.ano ? parseInt(query.ano) : undefined,
      query.tipoPagamento,
      query.search,
    );
    return ApiResponse.success('Funções obtidas com sucesso', response);
  }

  @Get(':id')
  @Roles(Role.USER)
  @HttpCode(HttpStatus.OK)
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const funcao = await this.funcaoService.findOne(id);
    const response = plainToInstance(FuncaoResponseDto, funcao);
    return ApiResponse.success('Função obtida com sucesso', response);
  }

  @Patch(':id')
  @Roles(Role.ADMIN)
  @HttpCode(HttpStatus.OK)
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateFuncaoDto: UpdateFuncaoDto,
  ) {
    const response = await this.funcaoService.update(id, updateFuncaoDto);
    return ApiResponse.success('Função atualizada com sucesso', response);
  }

  @Delete(':id')
  @Roles(Role.ADMIN)
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id', ParseIntPipe) id: number) {
    await this.funcaoService.remove(id);
    return ApiResponse.success('Função removida com sucesso');
  }
}
