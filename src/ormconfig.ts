import { DataSourceOptions } from 'typeorm';

export const ormconfig: DataSourceOptions = {
  type: 'postgres',
  host: 'postgres',
  port: parseInt(process.env.POSTGRES_PORT, 10) || 5432,
  username: process.env.POSTGRES_USER || 'root',
  password: process.env.POSTGRES_PASSWORD || 'root',
  database: process.env.POSTGRES_DB || 'root',
  entities: ['dist/**/entities/*.entity.js'],
  migrations: ['dist/**/migration/*.js'],
  migrationsRun: true,
  synchronize: false,
};
