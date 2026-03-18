import { IsString, IsNotEmpty, IsStrongPassword } from 'class-validator';

export class ResetPasswordDto {
  @IsString()
  @IsNotEmpty({ message: 'Token é obrigatório' })
  token: string;

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
  novaSenha: string;
}
