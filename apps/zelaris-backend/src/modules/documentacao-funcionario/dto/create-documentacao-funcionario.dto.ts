import {
  IsString,
  IsNotEmpty,
  MaxLength,
  IsEnum,
  IsOptional,
  IsDateString,
} from 'class-validator';
import { OrgaoEmissor } from '../../../shared/enums/orgao-emissor.enum';

export class CreateDocumentacaoFuncionarioDto {
  @IsString()
  @IsOptional()
  @MaxLength(50)
  ctps?: string | null;

  @IsString()
  @IsOptional()
  @MaxLength(20)
  serie?: string | null;

  @IsString()
  @IsOptional()
  @MaxLength(20)
  pis?: string | null;

  @IsString()
  @IsNotEmpty({ message: 'Identidade é obrigatório' })
  @MaxLength(20)
  identidade: string;

  @IsEnum(OrgaoEmissor)
  @IsNotEmpty({ message: 'Órgão emissor é obrigatório' })
  orgaoEmissor: OrgaoEmissor;

  @IsDateString({}, { message: 'Data de emissão inválida' })
  @IsNotEmpty({ message: 'Data de emissão é obrigatória' })
  dataEmissao: string;

  @IsString()
  @IsOptional()
  @MaxLength(20)
  tituloEleitor?: string | null;

  @IsString()
  @IsOptional()
  @MaxLength(10)
  zonaEleitoral?: string | null;
}
