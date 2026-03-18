import { IsEnum, IsNotEmpty, IsNumber } from 'class-validator';
import { MeioTransporte } from '../../../shared/enums/meio-transporte.enum';
import { TipoConducao } from '../../../shared/enums/tipo-conducao.enum';

export class CreateValeTransporteDto {
  @IsNotEmpty({ message: 'Tipo de condução é obrigatório' })
  @IsEnum(TipoConducao, { message: 'Tipo de condução inválido' })
  tipoConducao: TipoConducao;

  @IsNotEmpty({ message: 'Meio de transporte é obrigatório' })
  @IsEnum(MeioTransporte, { message: 'Meio de transporte inválido' })
  meioTransporte: MeioTransporte;

  @IsNotEmpty({ message: 'Quantidade é obrigatória' })
  quantidade: number;

  @IsNotEmpty({ message: 'Valor unitário é obrigatório' })
  @IsNumber()
  valorUnitario: number;

  @IsNotEmpty({ message: 'Valor total é obrigatório' })
  @IsNumber()
  valorTotal: number;
}
