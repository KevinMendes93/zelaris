import { IsOptional, IsString } from 'class-validator';
import { PaginationQueryDto } from '../../../shared/dto/pagination-query.dto';

export class ServicoListQueryDto extends PaginationQueryDto {
  @IsOptional()
  @IsString()
  dataHoraInicio?: string;

  @IsOptional()
  @IsString()
  dataHoraFim?: string;

  @IsOptional()
  @IsString()
  status?: string;

  @IsOptional()
  @IsString()
  clienteId?: string;
}
