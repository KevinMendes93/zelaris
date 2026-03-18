import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ContaBancaria } from './entities/conta-bancaria.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ContaBancaria])],
  providers: [],
  exports: [],
})
export class ContaBancariaModule {}
