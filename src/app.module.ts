import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MailerModule } from '@nestjs-modules/mailer';
import { mailConfig } from './mail/config/mail.config';
import { MailModule } from './mail/mail.module';
import { VerificationModule } from './verification/verification.module';
import { SupabaseModule } from './supabase/supabase.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MailerModule.forRootAsync({
      useFactory: mailConfig,
    }),
    MailModule,
    VerificationModule,
    SupabaseModule,
  ],
})
export class AppModule {}
