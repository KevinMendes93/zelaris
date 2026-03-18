import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('endereco')
export class Endereco {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column({ length: 10, default: null })
  numero: string;

  @Column({ length: 100 })
  endereco: string;

  @Column({ length: 50 })
  bairro: string;

  @Column({ length: 50 })
  municipio: string;

  @Column({ length: 2 })
  uf: string;

  @Column({ length: 10 })
  cep: string;
}
