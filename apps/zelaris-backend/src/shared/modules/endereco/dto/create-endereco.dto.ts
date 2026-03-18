import { IsNotEmpty, IsString, Matches, MaxLength } from 'class-validator';

export class CreateEnderecoDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  endereco: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(10)
  numero: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  bairro: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  municipio: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(2)
  uf: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(10)
  @Matches(/^\d{5}-?\d{3}$/, {
    message: 'CEP deve estar no formato XXXXX-XXX ou XXXXXXXX',
  })
  cep: string;
}
