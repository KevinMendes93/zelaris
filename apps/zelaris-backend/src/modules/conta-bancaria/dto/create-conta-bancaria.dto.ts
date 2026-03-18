import {
  IsString,
  IsNotEmpty,
  MaxLength,
  IsEnum,
  IsOptional,
} from 'class-validator';
import { TipoConta } from '../../../shared/enums/tipo-conta.enum';

export class CreateContaBancariaDto {
  @IsString()
  @IsNotEmpty({ message: 'Banco é obrigatório' })
  @MaxLength(100)
  banco: string;

  @IsString()
  @IsNotEmpty({ message: 'Agência é obrigatório' })
  @MaxLength(10)
  agencia: string;

  @IsString()
  @IsOptional()
  @MaxLength(2)
  agenciaDigito?: string | null;

  @IsString()
  @IsNotEmpty({ message: 'Conta é obrigatório' })
  @MaxLength(20)
  conta: string;

  @IsString()
  @IsOptional()
  @MaxLength(2)
  contaDigito?: string | null;

  @IsEnum(TipoConta)
  @IsNotEmpty({ message: 'Tipo de conta é obrigatório' })
  tipoConta: TipoConta;
}
