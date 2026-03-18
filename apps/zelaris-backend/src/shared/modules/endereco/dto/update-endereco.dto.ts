import { PartialType } from '@nestjs/mapped-types';
import { CreateEnderecoDto } from './create-endereco.dto';
import { IsNumber, IsOptional } from 'class-validator';

export class UpdateEnderecoDto extends PartialType(CreateEnderecoDto) {
  @IsNumber()
  @IsOptional()
  id?: number;
}
