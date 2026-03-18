import { BadRequestException, Injectable } from '@nestjs/common';
import { FuncaoService } from './funcao.service';
import { Funcao } from './entities/funcao.entity';
import { UpdateFuncionarioDto } from '../funcionario/dto/update-funcionario.dto';

@Injectable()
export class FuncaoValidators {
  constructor(private readonly funcaoService: FuncaoService) {}

  async validadeFuncaoBelongsToCurrentYearOnCreate(
    funcaoId: number,
  ): Promise<Funcao> {
    if (!funcaoId) {
      throw new BadRequestException('Função é obrigatória');
    }
    const funcao = await this.funcaoService.findOne(Number(funcaoId));
    const anoAtual = new Date().getFullYear();
    if (funcao.anoVigente !== anoAtual) {
      throw new BadRequestException(
        `A função selecionada não pertence ao ano vigente (${anoAtual})`,
      );
    }
    return funcao;
  }
  async validateFuncaoBelongsToCurrentYearOnUpdate(
    updateFuncionarioDto: UpdateFuncionarioDto,
  ): Promise<void> {
    if (updateFuncionarioDto.funcaoId !== undefined) {
      const funcao = await this.funcaoService.findOne(
        Number(updateFuncionarioDto.funcaoId),
      );
      const anoAtual = new Date().getFullYear();
      if (funcao.anoVigente !== anoAtual) {
        throw new BadRequestException(
          `A função selecionada não pertence ao ano vigente (${anoAtual})`,
        );
      }
      updateFuncionarioDto['funcao'] = funcao;
    }
  }
}
