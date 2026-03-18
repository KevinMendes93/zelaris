import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsString,
  MaxLength,
  Min,
} from 'class-validator';
import { TipoPagamento } from '../../../shared/enums/tipo-pagamento.enum';

export class CreateFuncaoDto {
  @IsString()
  @IsNotEmpty({ message: 'Nome da função é obrigatório' })
  @MaxLength(100, {
    message: 'Nome da função não pode ter mais de 100 caracteres',
  })
  nome: string;

  @IsEnum(TipoPagamento, { message: 'Tipo de pagamento inválido' })
  @IsNotEmpty({ message: 'Tipo de pagamento é obrigatório' })
  tipoPagamento: TipoPagamento;

  @IsNumber()
  @IsNotEmpty({ message: 'Salário é obrigatório' })
  @Min(0, { message: 'Salário deve ser maior ou igual a zero' })
  salario: number;

  @IsNumber()
  @IsNotEmpty({ message: 'Ano vigente é obrigatório' })
  @Min(1900, { message: 'Ano vigente deve ser maior ou igual a 1900' })
  anoVigente: number;
}
