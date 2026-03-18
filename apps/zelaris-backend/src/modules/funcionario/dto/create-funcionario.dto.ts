import {
  IsString,
  IsNotEmpty,
  MaxLength,
  IsEnum,
  IsOptional,
  IsBoolean,
  IsDateString,
  IsInt,
  ValidateIf,
  Matches,
  ValidateNested,
  IsEmail,
} from 'class-validator';
import { Type } from 'class-transformer';
import { IsCPF } from '../../../shared/utils/validators/is-cpf.validator';
import { GrauInstrucao } from '../../../shared/enums/grau-instrucao.enum';
import { EstadoCivil } from '../../../shared/enums/estado-civil.enum';
import { TipoSanguineo } from '../../../shared/enums/tipo-sanguineo.enum';
import { ModoTrabalho } from '../../../shared/enums/modo-trabalho.enum';
import { CreateEnderecoDto } from '../../../shared/modules/endereco/dto/create-endereco.dto';
import { CreateContaBancariaDto } from '../../conta-bancaria/dto/create-conta-bancaria.dto';
import { CreateDocumentacaoFuncionarioDto } from '../../documentacao-funcionario/dto/create-documentacao-funcionario.dto';
import { CreateValeTransporteDto } from '../../vale-transporte/dto/create-vale-transporte.dto';

export class CreateFuncionarioDto {
  @IsBoolean()
  @Type(() => Boolean)
  freelancer: boolean;

  @IsString()
  @IsNotEmpty({ message: 'Nome é obrigatório' })
  @MaxLength(100)
  nome: string;

  @IsDateString()
  @IsNotEmpty({ message: 'Data de nascimento é obrigatória' })
  dataNascimento: string;

  @IsString()
  @IsNotEmpty({ message: 'Telefone é obrigatório' })
  @Matches(/^\d{10,11}$/, {
    message: 'Telefone deve conter 10 ou 11 dígitos',
  })
  telefone: string;

  @ValidateIf((funcionario: CreateFuncionarioDto) => !funcionario.freelancer)
  @IsString()
  @IsNotEmpty({ message: 'Recado é obrigatório' })
  @Matches(/^\d{10,11}$/, {
    message: 'Recado deve conter 10 ou 11 dígitos',
  })
  recado?: string;

  @IsString()
  @IsNotEmpty({ message: 'CPF é obrigatório' })
  @IsCPF({ message: 'CPF inválido' })
  cpf: string;

  @IsEmail()
  @ValidateIf((funcionario: CreateFuncionarioDto) => !funcionario.freelancer)
  @IsNotEmpty({ message: 'Email é obrigatório' })
  email?: string;

  @ValidateNested()
  @Type(() => CreateEnderecoDto)
  @IsNotEmpty({ message: 'Endereço é obrigatório' })
  endereco: CreateEnderecoDto;

  @ValidateNested()
  @Type(() => CreateDocumentacaoFuncionarioDto)
  @IsOptional({ message: 'Documentação é opcional' })
  documentacao?: CreateDocumentacaoFuncionarioDto;

  @ValidateIf((funcionario: CreateFuncionarioDto) => !funcionario.freelancer)
  @IsEnum(GrauInstrucao)
  @IsNotEmpty({ message: 'Grau de instrução é obrigatório' })
  grauInstrucao?: GrauInstrucao;

  @ValidateIf((funcionario: CreateFuncionarioDto) => !funcionario.freelancer)
  @IsEnum(EstadoCivil)
  @IsNotEmpty({ message: 'Estado civil é obrigatório' })
  estadoCivil?: EstadoCivil;

  @IsEnum(TipoSanguineo)
  @IsOptional({ message: 'Tipo sanguíneo é opcional' })
  tipoSanguineo?: TipoSanguineo;

  @ValidateIf((funcionario: CreateFuncionarioDto) => !funcionario.freelancer)
  @IsString()
  @IsNotEmpty({ message: 'Naturalidade é obrigatória' })
  @MaxLength(30)
  naturalidade?: string;

  @IsString()
  @IsOptional()
  @MaxLength(100)
  nomePai?: string;

  @ValidateIf((funcionario: CreateFuncionarioDto) => !funcionario.freelancer)
  @IsString()
  @IsNotEmpty({ message: 'Nome da mãe é obrigatório' })
  @MaxLength(100)
  nomeMae?: string;

  @ValidateIf((funcionario: CreateFuncionarioDto) => !funcionario.freelancer)
  @IsInt()
  @IsNotEmpty({ message: 'Dependentes IR é obrigatório' })
  @Type(() => Number)
  dependentesIR?: number;

  @ValidateIf((funcionario: CreateFuncionarioDto) => !funcionario.freelancer)
  @IsInt()
  @IsNotEmpty()
  @Type(() => Number)
  filhosMenores14?: number;

  @ValidateIf((funcionario: CreateFuncionarioDto) => !funcionario.freelancer)
  @IsEnum(ModoTrabalho)
  @IsOptional()
  modoTrabalho?: ModoTrabalho;

  @IsInt()
  @IsNotEmpty()
  @Type(() => Number)
  funcaoId: number;

  @ValidateIf((funcionario: CreateFuncionarioDto) => !funcionario.freelancer)
  @IsDateString()
  @IsOptional()
  dataFimContratoExperiencia?: string;

  @ValidateIf(
    (funcionario: CreateFuncionarioDto) => funcionario.horarioInicio !== null,
  )
  @IsString()
  @IsOptional()
  @Matches(/^([0-1]\d|2[0-3]):[0-5]\d(:[0-5]\d)?$/, {
    message: 'Horário de início deve estar no formato HH:MM ou HH:MM:SS',
  })
  horarioInicio?: string;

  @ValidateIf(
    (funcionario: CreateFuncionarioDto) => funcionario.horarioInicio !== null,
  )
  @IsString()
  @IsOptional()
  @Matches(/^([0-1]\d|2[0-3]):[0-5]\d(:[0-5]\d)?$/, {
    message: 'Horário de fim deve estar no formato HH:MM ou HH:MM:SS',
  })
  horarioFim?: string;

  @IsDateString()
  @IsOptional()
  dataEncerramento?: string;

  @IsBoolean()
  @Type(() => Boolean)
  @IsOptional()
  temValeTransporte?: boolean;

  @ValidateNested({ each: true })
  @Type(() => CreateValeTransporteDto)
  @IsOptional()
  valeTransportes?: CreateValeTransporteDto[];

  @IsString()
  @IsOptional()
  @MaxLength(255)
  pix?: string;

  @ValidateNested()
  @Type(() => CreateContaBancariaDto)
  @IsOptional()
  contaBancaria?: CreateContaBancariaDto;
}
