import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { LocalFileStorageProvider } from './providers/local-file-storage.provider';
import { VercelBlobStorageProvider } from './providers/vercel-blob-storage.provider';
import {
  FileStorageProvider,
  StorageDriver,
  StoredFile,
} from './file-storage.types';

@Injectable()
export class FileStorageService {
  constructor(
    private readonly configService: ConfigService,
    private readonly localProvider: LocalFileStorageProvider,
    private readonly blobProvider: VercelBlobStorageProvider,
  ) {}

  async save(file: Express.Multer.File, folder: string): Promise<StoredFile> {
    return this.getProvider().save(file, folder);
  }

  async remove(location: string): Promise<void> {
    return this.getProviderByLocation(location).remove(location);
  }

  getDriver(): StorageDriver {
    const explicit = this.configService.get<string>('FILE_STORAGE_DRIVER');
    if (explicit === 'blob' || explicit === 'local') {
      return explicit;
    }

    const nodeEnv = this.configService.get<string>('NODE_ENV');
    return nodeEnv === 'production' ? 'blob' : 'local';
  }

  private getProvider(): FileStorageProvider {
    return this.getDriver() === 'blob' ? this.blobProvider : this.localProvider;
  }

  private getProviderByLocation(location: string): FileStorageProvider {
    if (/^https?:\/\//.test(location)) {
      return this.blobProvider;
    }

    return this.localProvider;
  }
}
