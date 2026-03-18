import { Exclude, Expose } from 'class-transformer';
import { StatusServico } from '../../../shared/enums/status-servico.enum';
import { AlocacaoResponseDto } from '../../alocacao/dto/alocacao-response.dto';
import { ClienteResponseDto } from '../../cliente/dto/cliente-response.dto';

@Exclude()
export class ServicoResponseDto {
  @Expose()
  id: string;

  @Expose()
  descricao: string;

  @Expose()
  data_hora_inicio: Date;

  @Expose()
  data_hora_fim: Date;

  @Expose()
  valor: number;

  @Expose()
  status: StatusServico;

  @Expose()
  cliente: ClienteResponseDto;

  @Expose()
  alocacoes: AlocacaoResponseDto[];

  @Expose()
  observacao?: string;

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;
}
