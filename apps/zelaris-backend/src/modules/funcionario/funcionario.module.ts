import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Funcionario } from './entities/funcionario.entity';
import { FuncionarioService } from './funcionario.service';
import { FuncionarioController } from './funcionario.controller';
import { DocumentacaoFuncionarioModule } from '../documentacao-funcionario/documentacao-funcionario.module';
import { FuncionarioValidators } from './funcionario.validators';
import { FuncaoModule } from '../funcao/funcao.module';
import { ContaBancaria } from '../conta-bancaria/entities/conta-bancaria.entity';
import { ValeTransporte } from '../vale-transporte/vale-transporte.entity';
import { Endereco } from '../../shared/modules/endereco/entities/endereco.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Funcionario,
      ContaBancaria,
      ValeTransporte,
      Endereco,
    ]),
    DocumentacaoFuncionarioModule,
    FuncaoModule,
  ],
  controllers: [FuncionarioController],
  providers: [FuncionarioService, FuncionarioValidators],
  exports: [FuncionarioService],
})
export class FuncionarioModule {}
