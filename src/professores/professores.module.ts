import { Module } from '@nestjs/common';
import { ProfessoresService } from './professores.service';
import { ProfessoresController } from './professores.controller';
import { MailService } from '../mail/mail.service';

@Module({
  providers: [ProfessoresService, MailService],
  exports: [ProfessoresService],
  controllers: [ProfessoresController]
})
export class ProfessoresModule {}
