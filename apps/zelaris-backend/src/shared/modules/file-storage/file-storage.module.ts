import { Global, Module } from '@nestjs/common';
import { FileNamingService } from './file-naming.service';
import { FileStorageService } from './file-storage.service';
import { LocalFileStorageProvider } from './providers/local-file-storage.provider';
import { VercelBlobStorageProvider } from './providers/vercel-blob-storage.provider';

@Global()
@Module({
  providers: [
    FileNamingService,
    LocalFileStorageProvider,
    VercelBlobStorageProvider,
    FileStorageService,
  ],
  exports: [FileStorageService],
})
export class FileStorageModule {}
