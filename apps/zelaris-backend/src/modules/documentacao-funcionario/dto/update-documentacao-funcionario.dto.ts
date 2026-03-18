import { PartialType } from '@nestjs/mapped-types';
import { CreateDocumentacaoFuncionarioDto } from './create-documentacao-funcionario.dto';
import { IsNumber, IsOptional } from 'class-validator';

export class UpdateDocumentacaoFuncionarioDto extends PartialType(
  CreateDocumentacaoFuncionarioDto,
) {
  @IsNumber()
  @IsOptional()
  id?: number;
}
