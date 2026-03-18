import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { MeioTransporte } from '../../shared/enums/meio-transporte.enum';
import { TipoConducao } from '../../shared/enums/tipo-conducao.enum';
import { Funcionario } from '../funcionario/entities/funcionario.entity';

@Entity('vale_transporte')
export class ValeTransporte {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @ManyToOne(() => Funcionario, (funcionario) => funcionario.valeTransportes, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  funcionario: Funcionario;

  @Column({
    type: 'enum',
    enum: TipoConducao,
  })
  tipoConducao: TipoConducao;

  @Column({
    type: 'enum',
    enum: MeioTransporte,
  })
  meioTransporte: MeioTransporte;

  @Column({ type: 'int' })
  quantidade: number;

  @Column({ type: 'float' })
  valorUnitario: number;

  @Column({ type: 'float' })
  valorTotal: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
