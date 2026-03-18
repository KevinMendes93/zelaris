import { IsOptional, IsString } from 'class-validator';
import { PaginationQueryDto } from '../../../shared/dto/pagination-query.dto';

export class ClienteListQueryDto extends PaginationQueryDto {
  @IsOptional()
  @IsString()
  createdAtFrom?: string;

  @IsOptional()
  @IsString()
  createdAtTo?: string;

  @IsOptional()
  @IsString()
  pessoaJuridica?: string;

  @IsOptional()
  @IsString()
  ativo?: string;
}
