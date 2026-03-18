import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { Endereco } from '../../../shared/modules/endereco/entities/endereco.entity';
import { Servico } from '../../servico/entities/servico.entity';

@Entity('clientes')
export class Cliente {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column({ type: 'varchar', length: 100 })
  nome: string;

  @Column({ type: 'varchar', unique: true })
  documento: string;

  @Column({ type: 'varchar', unique: true })
  email: string;

  @Column({ type: 'varchar', unique: true })
  telefone: string;

  @ManyToOne(() => Endereco, { eager: true, cascade: true })
  @JoinColumn()
  endereco: Endereco;

  @Column({ type: 'boolean', default: true })
  pessoaJuridica: boolean;

  @Column({ type: 'boolean', default: true })
  ativo: boolean;

  @OneToMany(() => Servico, (servico) => servico.cliente)
  servicos: Servico[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
