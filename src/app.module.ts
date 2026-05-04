import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MailerModule } from '@nestjs-modules/mailer';
import { mailConfig } from './mail/config/mail.config';
import { MailModule } from './mail/mail.module';
import { VerificationModule } from './verification/verification.module';
import { AlunosModule } from './alunos/alunos.module';
import { ProfessoresModule } from './professores/professores.module';
import { TurmasModule } from './turmas/turmas.module';
import { AuthModule } from './auth/auth.module';
import { EventosModule } from './eventos/eventos.module';
import { MateriaisModule } from './materiais/materiais.module';
import { AppService } from './app.service';
import { AppController } from './app.controller';
import { NotificationsModule } from './notifications/notifications.module';
import { LeaderboardModule } from './leaderboard/leaderboard.module';
import { PostsModule } from './posts/posts.module';
import { QuizzModule } from './quizz/quizz.module';
import { AvisosModule } from './avisos/avisos.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: '.env', }),
    MailerModule.forRootAsync({
      useFactory: mailConfig,
    }),
    MailModule,
    VerificationModule,
    AlunosModule,
    ProfessoresModule,
    TurmasModule,
    AuthModule,
    EventosModule,
    MateriaisModule,
    NotificationsModule,
    LeaderboardModule,
    PostsModule,
    QuizzModule,
    AvisosModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
