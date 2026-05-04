// main.ts
import 'reflect-metadata';
import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as classValidator from 'class-validator';
import * as classTransformer from 'class-transformer';
import * as oracledb from 'oracledb';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: '*',
  });
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      // Passamos as instâncias explicitamente se o loader falhar
      validatorPackage: classValidator,
      transformerPackage: classTransformer,
      transformOptions: {
        enableImplicitConversion: true,
      }
    }),
  );

  await app.listen(process.env.PORT || 3000);
}
bootstrap();
