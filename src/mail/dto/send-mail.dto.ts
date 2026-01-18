import { IsEmail, IsNotEmpty, IsObject, IsOptional } from 'class-validator';

export class SendMailDto {
  @IsEmail()
  to: string;

  @IsNotEmpty()
  subject: string;

  @IsNotEmpty()
  template: string;

  @IsOptional()
  @IsObject()
  context?: Record<string, any>;
}
