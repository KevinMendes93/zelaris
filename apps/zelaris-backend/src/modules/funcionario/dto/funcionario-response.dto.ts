import { Exclude, Expose } from 'class-transformer';
import { GrauInstrucao } from '../../../shared/enums/grau-instrucao.enum';
import { EstadoCivil } from '../../../shared/enums/estado-civil.enum';
import { TipoSanguineo } from '../../../shared/enums/tipo-sanguineo.enum';
import { ModoTrabalho } from '../../../shared/enums/modo-trabalho.enum';
import { FuncaoResponseDto } from '../../funcao/dto/funcao-response.dto';

@Exclude()
export class FuncionarioResponseDto {
  @Expose()
  id: number;

  @Expose()
  nome: string;

  @Expose()
  dataNascimento: Date;

  @Expose()
  telefone: string;

  @Expose()
  cpf: string;

  @Expose()
  email: string;

  @Expose()
  freelancer: boolean;

  @Expose()
  temValeTransporte: boolean;

  @Expose()
  funcao: FuncaoResponseDto;

  @Expose()
  endereco: any;

  @Expose()
  contaBancaria: any;

  @Expose()
  documentacao: any;

  @Expose()
  valeTransportes: any[];

  @Expose()
  grauInstrucao: GrauInstrucao;

  @Expose()
  estadoCivil: EstadoCivil;

  @Expose()
  naturalidade: string;

  @Expose()
  nomePai: string;

  @Expose()
  nomeMae: string;

  @Expose()
  recado: string;

  @Expose()
  dependentesIR: number;

  @Expose()
  filhosMenores14: number;

  @Expose()
  modoTrabalho: ModoTrabalho;

  @Expose()
  dataFimContratoExperiencia: Date;

  @Expose()
  horarioInicio: string;

  @Expose()
  horarioFim: string;

  @Expose()
  tipoSanguineo: TipoSanguineo;

  @Expose()
  dataEncerramento: Date;

  @Expose()
  pix?: string;

  @Expose()
  ativo: boolean;

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;
}
