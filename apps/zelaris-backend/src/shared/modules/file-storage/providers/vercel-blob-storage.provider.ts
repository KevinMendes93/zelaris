import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { del, put } from '@vercel/blob';
import { FileNamingService } from '../file-naming.service';
import { FileStorageProvider, StoredFile } from '../file-storage.types';

@Injectable()
export class VercelBlobStorageProvider implements FileStorageProvider {
  constructor(private readonly naming: FileNamingService) {}

  async save(file: Express.Multer.File, folder: string): Promise<StoredFile> {
    if (!file?.buffer) {
      throw new InternalServerErrorException(
        'Arquivo inválido para armazenamento no Blob',
      );
    }

    const fileName = this.naming.buildStorageName(file, 'doc');
    const key = `${folder}/${fileName}`;

    const result = await put(key, file.buffer, {
      access: 'public',
      contentType: file.mimetype,
      addRandomSuffix: false,
    });

    return {
      driver: 'blob',
      location: result.url,
      key,
      originalName: file.originalname,
      mimeType: file.mimetype,
      size: file.size,
    };
  }

  async remove(location: string): Promise<void> {
    // O del aceita URL do blob
    await del(location);
  }
}
