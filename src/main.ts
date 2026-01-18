// main.ts
import 'reflect-metadata';
import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as classValidator from 'class-validator';
import * as classTransformer from 'class-transformer';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      // Passamos as instâncias explicitamente se o loader falhar
      validatorPackage: classValidator,
      transformerPackage: classTransformer,
    }),
  );

  await app.listen(process.env.PORT || 3000);
}
bootstrap();
