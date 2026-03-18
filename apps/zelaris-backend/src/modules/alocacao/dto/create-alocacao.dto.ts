import { IsDateString, IsNotEmpty, IsBoolean, IsInt } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateAlocacaoDto {
  @IsDateString({}, { message: 'Data de início inválida' })
  @IsNotEmpty({ message: 'Data de início é obrigatória' })
  data_hora_inicio: string;

  @IsDateString({}, { message: 'Data de fim inválida' })
  @IsNotEmpty({ message: 'Data de fim é obrigatória' })
  data_hora_fim: string;

  @IsBoolean()
  @Type(() => Boolean)
  ft: boolean;

  @IsInt()
  @IsNotEmpty({ message: 'Serviço é obrigatório' })
  @Type(() => Number)
  servicoId: number;

  @IsInt()
  @IsNotEmpty({ message: 'Funcionário é obrigatório' })
  @Type(() => Number)
  funcionarioId: number;
}
