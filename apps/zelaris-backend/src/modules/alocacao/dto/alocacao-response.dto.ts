import { Exclude, Expose } from 'class-transformer';
import { FuncionarioResponseDto } from '../../funcionario/dto/funcionario-response.dto';
import { ServicoResponseDto } from '../../servico/dto/servico-response.dto';

@Exclude()
export class AlocacaoResponseDto {
  @Expose()
  id: number;

  @Expose()
  data_hora_inicio: Date;

  @Expose()
  data_hora_fim: Date;

  @Expose()
  ft: boolean;

  @Expose()
  servico: ServicoResponseDto;

  @Expose()
  funcionario: FuncionarioResponseDto;

  @Expose()
  horas_alocadas: number;

  @Expose()
  horas_ft: number;
}
