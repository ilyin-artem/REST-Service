import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule } from '@nestjs/swagger';
import 'dotenv/config';
import { readFile } from 'fs/promises';
import { dirname, join } from 'path';
import { parse } from 'yaml';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const rootDir = dirname(__dirname);
  const documentApi = await readFile(join(rootDir, 'doc', 'api.yaml'), 'utf-8');
  const parseDocumentApi = parse(documentApi);
  SwaggerModule.setup('doc', app, parseDocumentApi);
  app.useGlobalPipes(new ValidationPipe());
  await app.listen(process.env.PORT || 4000);
}
bootstrap();
