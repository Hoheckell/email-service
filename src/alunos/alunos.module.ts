import { Module } from '@nestjs/common';
import { AlunosService } from './alunos.service';
import { AlunosController } from './alunos.controller';
import { MailService } from '../mail/mail.service';

@Module({
  providers: [AlunosService, MailService],
  exports: [AlunosService],
  controllers: [AlunosController]
})
export class AlunosModule {}
