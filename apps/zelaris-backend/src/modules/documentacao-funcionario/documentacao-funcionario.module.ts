import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DocumentacaoFuncionario } from './entities/documentacao-funcionario.entity';

@Module({
  imports: [TypeOrmModule.forFeature([DocumentacaoFuncionario])],
  providers: [],
  exports: [],
})
export class DocumentacaoFuncionarioModule {}
