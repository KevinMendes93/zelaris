import { Module } from '@nestjs/common';
import { AlocacaoService } from './alocacao.service';
import { AlocacaoController } from './alocacao.controller';
import { Alocacao } from './entities/alocacao.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServicoModule } from '../servico/servico.module';
import { FuncionarioModule } from '../funcionario/funcionario.module';
import { AlocacaoValidators } from './alocacao.validators';

@Module({
  imports: [
    TypeOrmModule.forFeature([Alocacao]),
    ServicoModule,
    FuncionarioModule,
  ],
  controllers: [AlocacaoController],
  providers: [AlocacaoService, AlocacaoValidators],
  exports: [AlocacaoValidators],
})
export class AlocacaoModule {}
