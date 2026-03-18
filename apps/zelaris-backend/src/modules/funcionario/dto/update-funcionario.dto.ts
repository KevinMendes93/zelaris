import { PartialType, OmitType } from '@nestjs/mapped-types';
import { CreateFuncionarioDto } from './create-funcionario.dto';
import { ValidateNested, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';
import { UpdateEnderecoDto } from '../../../shared/modules/endereco/dto/update-endereco.dto';
import { UpdateDocumentacaoFuncionarioDto } from '../../documentacao-funcionario/dto/update-documentacao-funcionario.dto';
import { UpdateContaBancariaDto } from '../../conta-bancaria/dto/update-conta-bancaria.dto';
import { UpdateValeTransporteDto } from '../../vale-transporte/dto/update-vale-transporte.dto';

export class UpdateFuncionarioDto extends PartialType(
  OmitType(CreateFuncionarioDto, [
    'endereco',
    'documentacao',
    'contaBancaria',
    'valeTransportes',
  ] as const),
) {
  @ValidateNested()
  @Type(() => UpdateEnderecoDto)
  @IsOptional()
  endereco?: UpdateEnderecoDto;

  @ValidateNested()
  @Type(() => UpdateDocumentacaoFuncionarioDto)
  @IsOptional()
  documentacao?: UpdateDocumentacaoFuncionarioDto;

  @ValidateNested()
  @Type(() => UpdateContaBancariaDto)
  @IsOptional()
  contaBancaria?: UpdateContaBancariaDto;

  @ValidateNested({ each: true })
  @Type(() => UpdateValeTransporteDto)
  @IsOptional()
  valeTransportes?: UpdateValeTransporteDto[];
}
