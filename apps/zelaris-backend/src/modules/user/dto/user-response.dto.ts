import { Exclude, Expose } from 'class-transformer';
import { Role } from '../../../shared/enums/role.enum';

@Exclude()
export class UserResponseDto {
  @Expose()
  id: number;
  @Expose()
  nome: string;
  @Expose()
  cpf: string;
  @Expose()
  email: string;
  @Expose()
  telefone: string;
  @Expose()
  roles: Role[];
}
