import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './modules/user/user.module';
import { AuthModule } from './modules/auth/auth.module';
import { FuncaoModule } from './modules/funcao/funcao.module';
import { FuncionarioModule } from './modules/funcionario/funcionario.module';
import { DocumentacaoFuncionarioModule } from './modules/documentacao-funcionario/documentacao-funcionario.module';
import { ContaBancariaModule } from './modules/conta-bancaria/conta-bancaria.module';
import { AnexoFuncionarioModule } from './modules/anexo-funcionario/anexo-funcionario.module';
import { ClienteModule } from './modules/cliente/cliente.module';
import { ServicoModule } from './modules/servico/servico.module';
import { AlocacaoModule } from './modules/alocacao/alocacao.module';
import { FileStorageModule } from './shared/modules/file-storage/file-storage.module';
import { AppDataSource } from './database/data-source';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRootAsync({
      useFactory: () => ({
        ...AppDataSource.options,
        autoLoadEntities: true,
      }),
    }),
    UserModule,
    AuthModule,
    FuncaoModule,
    FuncionarioModule,
    DocumentacaoFuncionarioModule,
    ContaBancariaModule,
    AnexoFuncionarioModule,
    ClienteModule,
    ServicoModule,
    AlocacaoModule,
    FileStorageModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
