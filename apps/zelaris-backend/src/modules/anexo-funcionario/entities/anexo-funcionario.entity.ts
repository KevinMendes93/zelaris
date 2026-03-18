import { DocumentacaoFuncionario } from '../../documentacao-funcionario/entities/documentacao-funcionario.entity';
import { TipoAnexoFuncionario } from '../../../shared/enums/tipo-anexo-funcionario.enum';
import { Anexo } from '../../../shared/modules/anexo/anexo.entity';
import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';

@Entity('anexo_funcionario')
export class AnexoFuncionario extends Anexo {
  @ManyToOne(() => DocumentacaoFuncionario, (doc) => doc.anexos, {
    cascade: true,
  })
  @JoinColumn()
  documentacao: DocumentacaoFuncionario;

  @Column({
    type: 'enum',
    enum: TipoAnexoFuncionario,
    nullable: true,
  })
  tipo: TipoAnexoFuncionario | null;
}
