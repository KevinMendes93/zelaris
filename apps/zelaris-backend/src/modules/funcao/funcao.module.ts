import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Funcao } from './entities/funcao.entity';
import { FuncaoService } from './funcao.service';
import { FuncaoController } from './funcao.controller';
import { FuncaoValidators } from './funcao.validators';

@Module({
  imports: [TypeOrmModule.forFeature([Funcao])],
  controllers: [FuncaoController],
  providers: [FuncaoService, FuncaoValidators],
  exports: [FuncaoService, FuncaoValidators],
})
export class FuncaoModule {}
