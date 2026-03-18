import { PartialType } from '@nestjs/mapped-types';
import { CreateValeTransporteDto } from './create-vale-transporte.dto';
import { IsNumber, IsOptional } from 'class-validator';

export class UpdateValeTransporteDto extends PartialType(
  CreateValeTransporteDto,
) {
  @IsNumber()
  @IsOptional()
  id?: number;
}
