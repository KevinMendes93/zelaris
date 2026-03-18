import { IsEnum, IsOptional, IsString } from 'class-validator';
import { PaginationQueryDto } from '../../../shared/dto/pagination-query.dto';
import { TipoPagamento } from '../../../shared/enums/tipo-pagamento.enum';

export class FuncaoListQueryDto extends PaginationQueryDto {
  @IsOptional()
  @IsString()
  ano?: string;

  @IsOptional()
  @IsEnum(TipoPagamento)
  tipoPagamento?: TipoPagamento;
}
