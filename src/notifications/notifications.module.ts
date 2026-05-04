import { Module } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { NotificationsController } from './notifications.controller';
import { NotificationsGateway } from './notifications.gateway';
import { JwtModule } from '@nestjs/jwt';
import { ProfessoresService } from '../professores/professores.service';
import { AlunosService } from '../alunos/alunos.service';
import { MailService } from '../mail/mail.service';

@Module({
  imports: [JwtModule], // Necessário para validar o token no Gateway
  controllers: [NotificationsController],
  providers: [
    NotificationsService, 
    NotificationsGateway, // <--- Registra o Gateway
    ProfessoresService,
    AlunosService,
    MailService    
  ],
  exports: [
    NotificationsService, 
    NotificationsGateway // <--- Exporta para outros módulos (ex: MateriaisModule) usarem
  ],
})
export class NotificationsModule {}