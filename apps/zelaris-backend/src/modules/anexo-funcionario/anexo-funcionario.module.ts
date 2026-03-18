import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AnexoFuncionario } from './entities/anexo-funcionario.entity';
import { AnexoFuncionarioService } from './anexo-funcionario.service';
import { AnexoFuncionarioController } from './anexo-funcionario.controller';
import { FuncionarioModule } from '../funcionario/funcionario.module';

@Module({
  imports: [TypeOrmModule.forFeature([AnexoFuncionario]), FuncionarioModule],
  controllers: [AnexoFuncionarioController],
  providers: [AnexoFuncionarioService],
  exports: [AnexoFuncionarioService],
})
export class AnexoFuncionarioModule {}
