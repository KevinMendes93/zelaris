import { PartialType } from '@nestjs/mapped-types';
import { CreateContaBancariaDto } from './create-conta-bancaria.dto';
import { IsNumber, IsOptional } from 'class-validator';

export class UpdateContaBancariaDto extends PartialType(
  CreateContaBancariaDto,
) {
  @IsNumber()
  @IsOptional()
  id?: number;
}
