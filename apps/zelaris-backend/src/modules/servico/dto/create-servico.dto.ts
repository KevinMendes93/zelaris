import {
  IsString,
  IsNotEmpty,
  MaxLength,
  IsDateString,
  IsNumber,
  IsEnum,
  IsInt,
  IsOptional,
} from 'class-validator';
import { Type } from 'class-transformer';
import { StatusServico } from '../../../shared/enums/status-servico.enum';

export class CreateServicoDto {
  @IsString()
  @IsNotEmpty({ message: 'A descrição é obrigatória.' })
  @MaxLength(1000)
  descricao: string;

  @IsDateString()
  @IsNotEmpty({ message: 'A data e hora de início são obrigatórias.' })
  data_hora_inicio: string;

  @IsDateString()
  @IsOptional()
  data_hora_fim?: string | null;

  @IsNumber({ maxDecimalPlaces: 2 })
  @IsNotEmpty({ message: 'O valor é obrigatório.' })
  @Type(() => Number)
  valor: number;

  @IsEnum(StatusServico)
  @IsNotEmpty({ message: 'O status é obrigatório.' })
  status: StatusServico;

  @IsString()
  @IsOptional()
  @MaxLength(1000)
  observacao?: string | null;

  @IsInt()
  @IsNotEmpty({ message: 'O cliente é obrigatório.' })
  @Type(() => Number)
  clienteId: number;
}
