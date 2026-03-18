export type StorageDriver = 'local' | 'blob';

export interface StoredFile {
  driver: StorageDriver;
  location: string;
  key?: string;
  originalName: string;
  mimeType: string;
  size: number;
}

export interface FileStorageProvider {
  save(file: Express.Multer.File, folder: string): Promise<StoredFile>;
  remove(location: string): Promise<void>;
}
