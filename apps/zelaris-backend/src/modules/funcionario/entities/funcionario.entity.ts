import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
  OneToOne,
} from 'typeorm';
import { GrauInstrucao } from '../../../shared/enums/grau-instrucao.enum';
import { EstadoCivil } from '../../../shared/enums/estado-civil.enum';
import { TipoSanguineo } from '../../../shared/enums/tipo-sanguineo.enum';
import { ModoTrabalho } from '../../../shared/enums/modo-trabalho.enum';
import { Endereco } from '../../../shared/modules/endereco/entities/endereco.entity';
import { ContaBancaria } from '../../conta-bancaria/entities/conta-bancaria.entity';
import { DocumentacaoFuncionario } from '../../documentacao-funcionario/entities/documentacao-funcionario.entity';
import { ValeTransporte } from '../../vale-transporte/vale-transporte.entity';
import { Funcao } from '../../funcao/entities/funcao.entity';
import { Alocacao } from '../../alocacao/entities/alocacao.entity';

@Entity('funcionarios')
export class Funcionario {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column({ default: false })
  freelancer: boolean;

  @Column({ type: 'varchar', length: 100 })
  nome: string;

  @Column({ type: 'date' })
  dataNascimento: Date;

  @Column({ type: 'varchar', unique: true })
  telefone: string;

  @Column({ nullable: true })
  recado: string;

  @Column({ type: 'varchar', unique: true })
  cpf: string;

  @Column({ type: 'varchar', unique: true, nullable: true })
  email: string | null;

  @ManyToOne(() => Endereco, { eager: true, cascade: true })
  @JoinColumn()
  endereco: Endereco;

  @OneToOne(() => DocumentacaoFuncionario, (doc) => doc.funcionario, {
    cascade: true,
    eager: true,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn()
  documentacao: DocumentacaoFuncionario;

  @Column({
    type: 'enum',
    enum: GrauInstrucao,
    nullable: true,
  })
  grauInstrucao: GrauInstrucao | null;

  @Column({
    type: 'enum',
    enum: EstadoCivil,
    nullable: true,
  })
  estadoCivil: EstadoCivil | null;

  @Column({
    type: 'enum',
    enum: TipoSanguineo,
    nullable: true,
  })
  tipoSanguineo: TipoSanguineo | null;

  @Column({ type: 'varchar', length: 30, nullable: true })
  naturalidade: string | null;

  @Column({ type: 'varchar', length: 100, nullable: true })
  nomePai?: string | null;

  @Column({ type: 'varchar', length: 100, nullable: true })
  nomeMae: string | null;

  @Column({ type: 'int', nullable: true })
  dependentesIR: number | null;

  @Column({ type: 'int', nullable: true })
  filhosMenores14: number | null;

  @Column({
    type: 'enum',
    enum: ModoTrabalho,
    nullable: true,
  })
  modoTrabalho: ModoTrabalho | null;

  @ManyToOne(() => Funcao, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
  @JoinColumn()
  funcao: Funcao;

  @Column({ type: 'date', nullable: true })
  dataFimContratoExperiencia: Date | null;

  @Column({ type: 'time', nullable: true })
  horarioInicio: string | null;

  @Column({ type: 'time', nullable: true })
  horarioFim: string | null;

  @Column({ type: 'date', nullable: true })
  dataEncerramento: Date | null;

  @Column({ default: false })
  temValeTransporte: boolean;

  @OneToMany(() => ValeTransporte, (vale) => vale.funcionario, {
    cascade: true,
    eager: true,
    orphanedRowAction: 'delete',
  })
  valeTransportes: ValeTransporte[];

  @Column({ type: 'varchar', length: 255, nullable: true })
  pix?: string | null;

  @OneToOne(() => ContaBancaria, {
    eager: true,
    cascade: true,
    onDelete: 'CASCADE',
    orphanedRowAction: 'delete',
  })
  @JoinColumn()
  contaBancaria: ContaBancaria | null;

  @Column({ default: true })
  ativo: boolean;

  @OneToMany(() => Alocacao, (alocacao) => alocacao.funcionario)
  alocacoes: Alocacao[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
