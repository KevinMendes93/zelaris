import { Column, CreateDateColumn, PrimaryGeneratedColumn } from 'typeorm';

export abstract class Anexo {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column()
  path: string;

  @Column()
  originalName: string;

  @Column()
  mimeType: string;

  @Column({ type: 'bigint' })
  size: number;

  @CreateDateColumn()
  uploadedAt: Date;
}
