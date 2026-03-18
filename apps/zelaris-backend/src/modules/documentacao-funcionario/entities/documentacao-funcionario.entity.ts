import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  OneToMany,
} from 'typeorm';
import { OrgaoEmissor } from '../../../shared/enums/orgao-emissor.enum';
import { Funcionario } from '../../funcionario/entities/funcionario.entity';
import { AnexoFuncionario } from '../../anexo-funcionario/entities/anexo-funcionario.entity';

@Entity('documentacao_funcionario')
export class DocumentacaoFuncionario {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @OneToOne(() => Funcionario, (funcionario) => funcionario.documentacao)
  funcionario: Funcionario;

  @Column({ type: 'varchar', length: 50, nullable: true, unique: true })
  ctps: string | null;

  @Column({ type: 'varchar', length: 20, nullable: true, unique: true })
  serie: string | null;

  @Column({ type: 'varchar', length: 20, nullable: true, unique: true })
  pis: string | null;

  @Column({ length: 20, unique: true })
  identidade: string;

  @Column({
    type: 'enum',
    enum: OrgaoEmissor,
  })
  orgaoEmissor: OrgaoEmissor;

  @Column({ type: 'date' })
  dataEmissao: Date;

  @Column({ type: 'varchar', length: 20, nullable: true, unique: true })
  tituloEleitor: string | null;

  @Column({ type: 'varchar', length: 10, nullable: true })
  zonaEleitoral: string | null;

  @OneToMany(() => AnexoFuncionario, (anexo) => anexo.documentacao)
  anexos: AnexoFuncionario[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
