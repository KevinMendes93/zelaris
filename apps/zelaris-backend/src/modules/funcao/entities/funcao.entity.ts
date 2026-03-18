import { TipoPagamento } from '../../../shared/enums/tipo-pagamento.enum';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('funcoes')
export class Funcao {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column({ type: 'varchar', length: 100 })
  nome: string;

  @Column({ type: 'float' })
  salario: number;

  @Column({ type: 'enum', enum: TipoPagamento, default: TipoPagamento.MENSAL })
  tipoPagamento: TipoPagamento;

  @Column({ type: 'int' })
  anoVigente: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
