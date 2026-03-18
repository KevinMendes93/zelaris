import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { extname } from 'path';

@Injectable()
export class FileNamingService {
  private readonly mimeToExtension: Record<string, string> = {
    'image/jpeg': '.jpg',
    'image/png': '.png',
    'application/pdf': '.pdf',
  };

  buildStorageName(file: Express.Multer.File, prefix = 'doc'): string {
    const safeBase = this.slugify(prefix);
    const extension = this.resolveExtension(file);
    return `${safeBase}-${Date.now()}-${randomUUID()}${extension}`;
  }

  private resolveExtension(file: Express.Multer.File): string {
    const byMime = this.mimeToExtension[file.mimetype];
    if (byMime) return byMime;

    const originalExt = extname(file.originalname || '').toLowerCase();
    if (originalExt) return originalExt;

    return '.bin';
  }

  private slugify(value: string): string {
    return value
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-zA-Z0-9-]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '')
      .toLowerCase();
  }
}
