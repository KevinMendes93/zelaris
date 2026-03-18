import { Funcionario } from '../../funcionario/entities/funcionario.entity';
import { TipoConta } from '../../../shared/enums/tipo-conta.enum';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
} from 'typeorm';

@Entity('conta_bancaria')
export class ContaBancaria {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column({ type: 'varchar', length: 100 })
  banco: string;

  @Column({ type: 'varchar', length: 10 })
  agencia: string;

  @Column({ type: 'varchar', length: 2, nullable: true })
  agenciaDigito: string | null;

  @Column({ type: 'varchar', length: 20 })
  conta: string;

  @Column({ type: 'varchar', length: 2, nullable: true })
  contaDigito: string | null;

  @Column({
    type: 'enum',
    enum: TipoConta,
  })
  tipoConta: TipoConta;

  @OneToOne(() => Funcionario, (funcionario) => funcionario.contaBancaria)
  funcionario: Funcionario;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
