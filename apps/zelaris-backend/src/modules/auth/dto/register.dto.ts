import {
  IsString,
  IsNotEmpty,
  IsEmail,
  IsStrongPassword,
  IsEnum,
  IsOptional,
} from 'class-validator';
import { Role } from '../../../shared/enums/role.enum';
import { IsCPF } from '../../../shared/utils/validators/is-cpf.validator';

export class RegisterDto {
  @IsString()
  @IsNotEmpty({ message: 'Nome é obrigatório' })
  nome: string;

  @IsString()
  @IsNotEmpty({ message: 'CPF é obrigatório' })
  @IsCPF({ message: 'CPF inválido' })
  cpf: string;

  @IsStrongPassword(
    {
      minLength: 8,
      minLowercase: 1,
      minUppercase: 1,
      minNumbers: 1,
      minSymbols: 1,
    },
    {
      message:
        'Senha deve ter no mínimo 8 caracteres, uma letra maiúscula, uma letra minúscula, um número e um símbolo',
    },
  )
  @IsNotEmpty({ message: 'Senha é obrigatória' })
  senha: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsOptional()
  telefone?: string;

  @IsEnum(Role, { each: true })
  @IsOptional()
  roles?: Role[];
}
