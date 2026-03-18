import { Exclude, Expose } from 'class-transformer';
import { TipoPagamento } from '../../../shared/enums/tipo-pagamento.enum';

@Exclude()
export class FuncaoResponseDto {
  @Expose()
  id: number;

  @Expose()
  nome: string;

  @Expose()
  salario: number;

  @Expose()
  tipoPagamento: TipoPagamento;

  @Expose()
  anoVigente: number;

  @Expose()
  createdBy: number;

  @Expose()
  updatedBy: number;

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;
}
