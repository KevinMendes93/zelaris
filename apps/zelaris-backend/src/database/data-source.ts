import 'reflect-metadata';
import { config } from 'dotenv';
import { DataSource } from 'typeorm';
import { join } from 'path';

config();

export const AppDataSource = new DataSource({
  type: 'postgres',
  url: process.env.DATABASE_URL, // se tiver, usa URL
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT) || 5432,
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,

  entities: [join(__dirname, '..', '**', '*.entity.{ts,js}')],

  migrations: [join(__dirname, 'migrations', '*{.ts,.js}')],

  synchronize: process.env.NODE_ENV === 'development',
  ssl: process.env.DATABASE_URL ? { rejectUnauthorized: false } : false,
  logging: process.env.NODE_ENV === 'development',
});
