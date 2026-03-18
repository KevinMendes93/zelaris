import {
  IsString,
  IsNotEmpty,
  MaxLength,
  Matches,
  ValidateNested,
  IsEmail,
  IsBoolean,
} from 'class-validator';
import { Type } from 'class-transformer';
import { CreateEnderecoDto } from '../../../shared/modules/endereco/dto/create-endereco.dto';
import { IsCpfOrCnpj } from '../../../shared/utils/validators/is-cpf-or-cnpj-validator';

export class CreateClienteDto {
  @IsString()
  @IsNotEmpty({ message: 'Nome é obrigatório' })
  @MaxLength(100)
  nome: string;

  @IsString()
  @IsNotEmpty({ message: 'Documento é obrigatório' })
  @IsCpfOrCnpj({ message: 'CPF ou CNPJ inválido' })
  documento: string;

  @IsEmail()
  @IsNotEmpty({ message: 'Email é obrigatório' })
  email: string;

  @IsString()
  @IsNotEmpty({ message: 'Telefone é obrigatório' })
  @Matches(/^\d{10,11}$/, {
    message: 'Telefone deve conter 10 ou 11 dígitos',
  })
  telefone: string;

  @ValidateNested()
  @Type(() => CreateEnderecoDto)
  @IsNotEmpty({ message: 'Endereço é obrigatório' })
  endereco: CreateEnderecoDto;

  @IsBoolean()
  @Type(() => Boolean)
  pessoaJuridica: boolean;

  @IsBoolean()
  @Type(() => Boolean)
  ativo: boolean;
}
