import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsStrongPassword,
} from 'class-validator';
import { IsCPF } from '../../../shared/utils/validators/is-cpf.validator';
import { Role } from '../../../shared/enums/role.enum';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty({ message: 'Nome é obrigatório' })
  nome: string;

  @IsString()
  @IsNotEmpty({ message: 'CPF é obrigatório' })
  @IsCPF({ message: 'CPF inválido' })
  cpf: string;

  @IsStrongPassword({
    minLength: 8,
    minLowercase: 1,
    minUppercase: 1,
    minNumbers: 1,
    minSymbols: 1,
  })
  @IsNotEmpty({ message: 'Senha é obrigatória' })
  senha: string;

  @IsEmail()
  @IsNotEmpty({ message: 'Email é obrigatório' })
  email: string;

  @IsNumber()
  @IsOptional({ message: 'Telefone é opcional' })
  telefone?: string | null;

  @IsEnum(Role, { each: true })
  roles?: Role[];
}
