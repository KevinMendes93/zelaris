import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';
import { CreateFuncionarioDto } from './dto/create-funcionario.dto';
import { Funcionario } from './entities/funcionario.entity';
import { Repository, Not } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { UpdateFuncionarioDto } from './dto/update-funcionario.dto';

@Injectable()
export class FuncionarioValidators {
  constructor(
    @InjectRepository(Funcionario)
    private readonly funcionarioRepository: Repository<Funcionario>,
  ) {}

  async validate(createFuncionarioDto: CreateFuncionarioDto) {
    await this.validateUniqueFields(createFuncionarioDto);

    this.validateRequiredFieldsOfDocumentacaoIfNotFreelancer(
      createFuncionarioDto,
    );
  }

  async validateUpdate(updateFuncionarioDto: UpdateFuncionarioDto, id: number) {
    await this.validateUniqueFieldsForUpdate(id, updateFuncionarioDto);

    this.validateUpdateFieldsOfDocumentacaoIfNotFreelancer(
      updateFuncionarioDto,
    );
  }

  private async validateUniqueFields(
    createFuncionarioDto: CreateFuncionarioDto,
  ): Promise<void> {
    const validateUnique = async (
      where: Record<string, any>,
      mensagem: string,
    ) => {
      const existing = await this.funcionarioRepository.findOne({ where });
      if (existing) throw new ConflictException(mensagem);
    };

    const validations: Promise<void>[] = [];
    const { cpf, telefone, documentacao } = createFuncionarioDto;

    if (cpf) validations.push(validateUnique({ cpf }, 'CPF já cadastrado'));
    if (telefone)
      validations.push(validateUnique({ telefone }, 'Telefone já cadastrado'));

    if (documentacao?.ctps)
      validations.push(
        validateUnique(
          { documentacao: { ctps: documentacao.ctps } },
          'CTPS já cadastrada',
        ),
      );
    if (documentacao?.pis)
      validations.push(
        validateUnique(
          { documentacao: { pis: documentacao.pis } },
          'PIS já cadastrado',
        ),
      );
    if (documentacao?.identidade)
      validations.push(
        validateUnique(
          { documentacao: { identidade: documentacao.identidade } },
          'Identidade já cadastrada',
        ),
      );
    if (documentacao?.tituloEleitor)
      validations.push(
        validateUnique(
          { documentacao: { tituloEleitor: documentacao.tituloEleitor } },
          'Título eleitoral já cadastrado',
        ),
      );

    await Promise.all(validations);
  }

  private async validateUniqueFieldsForUpdate(
    funcionarioId: number,
    updateFuncionarioDto: UpdateFuncionarioDto,
  ): Promise<void> {
    const validateUnique = async (
      where: Record<string, any>,
      mensagem: string,
    ) => {
      const existing = await this.funcionarioRepository.findOne({
        where: { ...where, id: Not(funcionarioId) },
      });
      if (existing) throw new ConflictException(mensagem);
    };

    const validations: Promise<void>[] = [];
    const { cpf, telefone, documentacao } = updateFuncionarioDto;

    if (cpf)
      validations.push(
        validateUnique({ cpf }, 'CPF já cadastrado para outro funcionário'),
      );
    if (telefone)
      validations.push(
        validateUnique(
          { telefone },
          'Telefone já cadastrado para outro funcionário',
        ),
      );

    if (documentacao?.ctps)
      validations.push(
        validateUnique(
          { documentacao: { ctps: documentacao.ctps } },
          'CTPS já cadastrada para outro funcionário',
        ),
      );
    if (documentacao?.pis)
      validations.push(
        validateUnique(
          { documentacao: { pis: documentacao.pis } },
          'PIS já cadastrado para outro funcionário',
        ),
      );
    if (documentacao?.identidade)
      validations.push(
        validateUnique(
          { documentacao: { identidade: documentacao.identidade } },
          'Identidade já cadastrada para outro funcionário',
        ),
      );
    if (documentacao?.tituloEleitor)
      validations.push(
        validateUnique(
          { documentacao: { tituloEleitor: documentacao.tituloEleitor } },
          'Título eleitoral já cadastrado para outro funcionário',
        ),
      );

    await Promise.all(validations);
  }

  private validateRequiredFieldsOfDocumentacaoIfNotFreelancer(
    createFuncionarioDto: CreateFuncionarioDto,
  ): void {
    if (!createFuncionarioDto.freelancer) {
      if (!createFuncionarioDto.documentacao?.ctps) {
        throw new BadRequestException(
          'CTPS é obrigatório para não freelancers',
        );
      }
      if (!createFuncionarioDto.documentacao?.serie) {
        throw new BadRequestException(
          'Série é obrigatório para não freelancers',
        );
      }
      if (!createFuncionarioDto.documentacao?.pis) {
        throw new BadRequestException('PIS é obrigatório para não freelancers');
      }
    }
  }

  private validateUpdateFieldsOfDocumentacaoIfNotFreelancer(
    updateFuncionarioDto: UpdateFuncionarioDto,
  ): void {
    if (updateFuncionarioDto.documentacao && !updateFuncionarioDto.freelancer) {
      if (!updateFuncionarioDto.documentacao.ctps) {
        throw new BadRequestException(
          'CTPS é obrigatório para não freelancers',
        );
      }
      if (!updateFuncionarioDto.documentacao.serie) {
        throw new BadRequestException(
          'Série é obrigatório para não freelancers',
        );
      }
      if (!updateFuncionarioDto.documentacao.pis) {
        throw new BadRequestException('PIS é obrigatório para não freelancers');
      }
    }
  }
}
