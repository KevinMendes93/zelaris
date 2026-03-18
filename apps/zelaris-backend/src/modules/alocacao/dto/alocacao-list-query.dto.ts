import { Transform } from 'class-transformer';
import { IsBoolean, IsOptional, IsString } from 'class-validator';
import { PaginationQueryDto } from '../../../shared/dto/pagination-query.dto';

export class AlocacaoListQueryDto extends PaginationQueryDto {
  @IsOptional()
  @IsString()
  dataHoraInicio?: string;

  @IsOptional()
  @IsString()
  dataHoraFim?: string;

  @IsOptional()
  @IsString()
  funcionarioId?: string;

  @IsOptional()
  @IsString()
  clienteId?: string;

  @IsOptional()
  @Transform(({ value }) => {
    if (value === 'true') return true;
    if (value === 'false') return false;
    return undefined;
  })
  @IsBoolean()
  ft?: boolean;
}
