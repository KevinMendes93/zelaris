import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { promises as fs } from 'fs';
import * as path from 'path';
import { FileNamingService } from '../file-naming.service';
import { FileStorageProvider, StoredFile } from '../file-storage.types';

@Injectable()
export class LocalFileStorageProvider implements FileStorageProvider {
  constructor(private readonly naming: FileNamingService) {}

  async save(file: Express.Multer.File, folder: string): Promise<StoredFile> {
    if (!file?.buffer) {
      throw new InternalServerErrorException(
        'Arquivo inválido para armazenamento local',
      );
    }

    const fileName = this.naming.buildStorageName(file, 'doc');
    const relativeDir = path.join('uploads', folder);
    const absoluteDir = path.resolve(process.cwd(), relativeDir);
    const relativeLocation = path.join(relativeDir, fileName);
    const absoluteLocation = path.resolve(process.cwd(), relativeLocation);

    await fs.mkdir(absoluteDir, { recursive: true });
    await fs.writeFile(absoluteLocation, file.buffer);

    return {
      driver: 'local',
      location: relativeLocation.replace(/\\/g, '/'),
      originalName: file.originalname,
      mimeType: file.mimetype,
      size: file.size,
    };
  }

  async remove(location: string): Promise<void> {
    const uploadsRoot = path.resolve(process.cwd(), 'uploads');
    const absoluteLocation = path.isAbsolute(location)
      ? path.resolve(location)
      : path.resolve(process.cwd(), location);

    const relativeToUploads = path.relative(uploadsRoot, absoluteLocation);
    if (
      relativeToUploads.startsWith('..') ||
      path.isAbsolute(relativeToUploads)
    ) {
      throw new InternalServerErrorException('Caminho de arquivo inválido');
    }

    try {
      await fs.unlink(absoluteLocation);
    } catch (err) {
      const code = (err as NodeJS.ErrnoException).code;
      if (code !== 'ENOENT') {
        throw new InternalServerErrorException(
          'Falha ao remover arquivo local',
        );
      }
    }
  }
}
