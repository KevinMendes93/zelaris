import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TipoAnexoFuncionario } from '../../shared/enums/tipo-anexo-funcionario.enum';
import { DocumentacaoFuncionario } from '../documentacao-funcionario/entities/documentacao-funcionario.entity';
import { AnexoFuncionario } from './entities/anexo-funcionario.entity';
import { FileStorageService } from '../../shared/modules/file-storage/file-storage.service';

@Injectable()
export class AnexoFuncionarioService {
  private readonly MAX_ANEXOS = 5;

  constructor(
    @InjectRepository(AnexoFuncionario)
    private readonly anexoRepository: Repository<AnexoFuncionario>,
    private readonly fileStorageService: FileStorageService,
  ) {}

  async create(
    documentacao: DocumentacaoFuncionario,
    file: Express.Multer.File,
    tipo?: TipoAnexoFuncionario,
  ): Promise<AnexoFuncionario> {
    await this.validateMaxAnexos(documentacao.id);

    const stored = await this.fileStorageService.save(
      file,
      'documentacao-funcionario',
    );

    const anexo = this.anexoRepository.create({
      documentacao,
      tipo: tipo || TipoAnexoFuncionario.OUTRO,
      path: stored.location,
      originalName: stored.originalName,
      mimeType: stored.mimeType,
      size: stored.size,
    });

    return this.anexoRepository.save(anexo);
  }

  async findByDocumentacao(
    documentacaoId: number,
  ): Promise<AnexoFuncionario[]> {
    return this.anexoRepository.find({
      where: { documentacao: { id: documentacaoId } },
      order: { uploadedAt: 'DESC' },
    });
  }

  async remove(id: number): Promise<void> {
    const anexo = await this.findOne(id);

    const storedPath = anexo.path?.trim();
    if (!storedPath) {
      throw new BadRequestException('Caminho do anexo inválido');
    }

    await this.fileStorageService.remove(storedPath);

    await this.anexoRepository.remove(anexo);
  }

  async findOneWithDocumentacao(id: number): Promise<AnexoFuncionario> {
    const anexo = await this.anexoRepository.findOne({
      where: { id },
      relations: { documentacao: true },
    });
    if (!anexo) {
      throw new NotFoundException(`Anexo com ID ${id} não encontrado`);
    }
    return anexo;
  }

  private async findOne(id: number): Promise<AnexoFuncionario> {
    const anexo = await this.anexoRepository.findOne({ where: { id } });
    if (!anexo) {
      throw new NotFoundException(`Anexo com ID ${id} não encontrado`);
    }
    return anexo;
  }

  private async countByDocumentacao(documentacaoId: number): Promise<number> {
    return this.anexoRepository.count({
      where: { documentacao: { id: documentacaoId } },
    });
  }

  private async validateMaxAnexos(documentacaoId: number): Promise<void> {
    const count = await this.countByDocumentacao(documentacaoId);
    if (count >= this.MAX_ANEXOS) {
      throw new BadRequestException(
        `Limite de ${this.MAX_ANEXOS} anexos por funcionário atingido`,
      );
    }
  }
}
