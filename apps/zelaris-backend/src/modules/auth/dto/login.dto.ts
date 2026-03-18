import { IsString, IsNotEmpty, MinLength } from 'class-validator';
import { IsCPF } from '../../../shared/utils/validators/is-cpf.validator';

export class LoginDto {
  @IsString()
  @IsNotEmpty({ message: 'CPF é obrigatório' })
  @IsCPF({ message: 'CPF inválido' })
  cpf: string;

  @IsString()
  @IsNotEmpty({ message: 'Senha é obrigatória' })
  @MinLength(6, { message: 'Senha deve ter no mínimo 6 caracteres' })
  senha: string;
}
