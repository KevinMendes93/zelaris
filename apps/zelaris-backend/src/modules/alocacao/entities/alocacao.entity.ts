import { Funcionario } from '../../funcionario/entities/funcionario.entity';
import { Servico } from '../../servico/entities/servico.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  Column,
  UpdateDateColumn,
  CreateDateColumn,
} from 'typeorm';

@Entity('alocacoes')
export class Alocacao {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column({ type: 'timestamptz' })
  data_hora_inicio: Date;

  @Column({ type: 'timestamptz' })
  data_hora_fim: Date;

  @Column({ type: 'boolean', default: false })
  ft: boolean;

  @ManyToOne(() => Servico, (servico) => servico.alocacoes, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'servico_id' })
  servico: Servico;

  @ManyToOne(() => Funcionario, (funcionario) => funcionario.alocacoes, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  funcionario: Funcionario;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  get horas_alocadas(): number {
    if (!this.data_hora_inicio || !this.data_hora_fim) {
      return 0;
    }
    const diffEmMs =
      new Date(this.data_hora_fim).getTime() -
      new Date(this.data_hora_inicio).getTime();
    return diffEmMs / (1000 * 60 * 60);
  }

  get horas_ft(): number {
    return this.ft ? this.horas_alocadas : 0;
  }
}
