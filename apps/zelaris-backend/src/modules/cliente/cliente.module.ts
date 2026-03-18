import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClienteService } from './cliente.service';
import { ClienteController } from './cliente.controller';
import { Cliente } from './entities/cliente.entity';
import { Endereco } from '../../shared/modules/endereco/entities/endereco.entity';
import { ClienteValidators } from './cliente.validators';

@Module({
  imports: [TypeOrmModule.forFeature([Cliente, Endereco])],
  controllers: [ClienteController],
  providers: [ClienteService, ClienteValidators],
})
export class ClienteModule {}
