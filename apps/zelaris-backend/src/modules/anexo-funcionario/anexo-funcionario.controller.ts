import { AnexoFuncionarioService } from './anexo-funcionario.service';
import {
  Post,
  UseInterceptors,
  Param,
  ParseIntPipe,
  HttpStatus,
  UseGuards,
  Res,
  NotFoundException,
} from '@nestjs/common';
import { Body, UploadedFile, HttpCode } from '@nestjs/common';
import { Controller } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { BadRequestException } from '@nestjs/common';
import { Role } from '../../shared/enums/role.enum';
import { Roles } from '../../shared/utils/decorators/roles.decorator';
import { TipoAnexoFuncionario } from '../../shared/enums/tipo-anexo-funcionario.enum';
import { Get } from '@nestjs/common';
import { Delete } from '@nestjs/common';
import { FuncionarioService } from '../funcionario/funcionario.service';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { ApiResponse } from '../../shared/dto/api-response.dto';
import type { Response } from 'express';
import { createReadStream } from 'fs';
import { stat } from 'fs/promises';
import { memoryStorage } from 'multer';
import { join } from 'path';

@Controller('anexo-funcionario')
@UseGuards(JwtAuthGuard, RolesGuard)
export class AnexoFuncionarioController {
  constructor(
    private readonly anexoService: AnexoFuncionarioService,
    private readonly funcionarioService: FuncionarioService,
  ) {}

  @Post(':id')
  @Roles(Role.ADMIN)
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(
    FileInterceptor('file', {
      storage: memoryStorage(),
      limits: {
        fileSize: 5 * 1024 * 1024,
      },
      fileFilter: (req, file, callback) => {
        if (!file.mimetype.match(/\/(jpg|jpeg|png|pdf)$/)) {
          return callback(
            new BadRequestException('Apenas imagens e PDFs são permitidos'),
            false,
          );
        }
        callback(null, true);
      },
    }),
  )
  async uploadAnexo(
    @Param('id', ParseIntPipe) id: number,
    @UploadedFile() file: Express.Multer.File,
    @Body('tipo') tipo?: TipoAnexoFuncionario,
  ) {
    if (!file) {
      throw new BadRequestException('Arquivo não fornecido');
    }

    const funcionario = await this.funcionarioService.findOne(id);
    const anexo = await this.anexoService.create(
      funcionario.documentacao,
      file,
      tipo,
    );

    return ApiResponse.success('Anexo enviado com sucesso', anexo);
  }

  @Get(':id')
  @Roles(Role.USER)
  @HttpCode(HttpStatus.OK)
  async getAnexos(@Param('id', ParseIntPipe) id: number) {
    const funcionario = await this.funcionarioService.findOne(id);

    const anexos = await this.anexoService.findByDocumentacao(
      funcionario.documentacao.id,
    );
    return ApiResponse.success('Anexos obtidos com sucesso', anexos);
  }

  @Delete(':id/:anexoId')
  @Roles(Role.ADMIN)
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteAnexo(
    @Param('id', ParseIntPipe) id: number,
    @Param('anexoId', ParseIntPipe) anexoId: number,
  ) {
    const funcionario = await this.funcionarioService.findOne(id);
    const anexo = await this.anexoService.findOneWithDocumentacao(anexoId);

    if (anexo.documentacao.id !== funcionario.documentacao.id) {
      throw new NotFoundException('Anexo não encontrado para este funcionário');
    }

    await this.anexoService.remove(anexoId);
    return ApiResponse.success('Anexo removido com sucesso');
  }

  @Get(':id/:anexoId/download')
  @Roles(Role.USER)
  @HttpCode(HttpStatus.OK)
  async downloadAnexo(
    @Param('id', ParseIntPipe) id: number,
    @Param('anexoId', ParseIntPipe) anexoId: number,
    @Res() res: Response,
  ) {
    const funcionario = await this.funcionarioService.findOne(id);
    const anexo = await this.anexoService.findOneWithDocumentacao(anexoId);

    // Verificar se o anexo pertence ao funcionário
    if (anexo.documentacao.id !== funcionario.documentacao.id) {
      throw new NotFoundException('Anexo não encontrado para este funcionário');
    }

    if (/^https?:\/\//.test(anexo.path)) {
      return res.redirect(anexo.path);
    }

    // Resolver o caminho do arquivo
    const filePath = join(process.cwd(), anexo.path);

    // Verificar se o arquivo existe
    try {
      await stat(filePath);
    } catch {
      throw new NotFoundException('Arquivo não encontrado no servidor');
    }

    // Configurar headers para download
    res.setHeader('Content-Type', anexo.mimeType);
    res.setHeader(
      'Content-Disposition',
      `attachment; filename="${anexo.originalName}"`,
    );

    // Stream do arquivo
    const fileStream = createReadStream(filePath);
    fileStream.pipe(res);
  }
}
