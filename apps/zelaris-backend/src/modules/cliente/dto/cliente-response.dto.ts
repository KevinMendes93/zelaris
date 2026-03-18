import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class ClienteResponseDto {
  @Expose()
  id: number;

  @Expose()
  nome: string;

  @Expose()
  documento: string;

  @Expose()
  email: string;

  @Expose()
  telefone: string;

  @Expose()
  endereco: any;

  @Expose()
  pessoaJuridica: boolean;

  @Expose()
  ativo: boolean;

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;
}
