import { StatusServico } from '../../../shared/enums/status-servico.enum';
import { Alocacao } from '../../alocacao/entities/alocacao.entity';
import { Cliente } from '../../cliente/entities/cliente.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'servicos' })
export class Servico {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column({ type: 'varchar', length: 1000 })
  descricao: string;

  @Column({ type: 'timestamptz' })
  data_hora_inicio: Date;

  @Column({ type: 'timestamptz', nullable: true })
  data_hora_fim?: Date | null;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  valor: number;

  @Column({
    type: 'enum',
    enum: StatusServico,
    default: StatusServico.AGENDADO,
  })
  status: StatusServico;

  @Column({ type: 'varchar', length: 1000, nullable: true })
  observacao?: string | null;

  @ManyToOne(() => Cliente, (cliente) => cliente.servicos, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn()
  cliente: Cliente;

  @OneToMany(() => Alocacao, (alocacao) => alocacao.servico)
  alocacoes: Alocacao[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
