import { PartialType, OmitType } from '@nestjs/mapped-types';
import { ValidateNested, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';
import { UpdateEnderecoDto } from '../../../shared/modules/endereco/dto/update-endereco.dto';
import { CreateClienteDto } from './create-cliente.dto';

export class UpdateClienteDto extends PartialType(
  OmitType(CreateClienteDto, ['endereco'] as const),
) {
  @ValidateNested()
  @Type(() => UpdateEnderecoDto)
  @IsOptional()
  endereco?: UpdateEnderecoDto;
}
