import { Body, Controller, Post, Headers } from '@nestjs/common';
import { MailService } from './mail.service';
import { SendMailDto } from './dto/send-mail.dto';

@Controller('mail')
export class MailController {
  constructor(private readonly mailService: MailService) {}

  @Post('send')
  async send(@Body() dto: SendMailDto, @Headers('x-token') token: string) {
    if (token == process.env.X_TOKEN) {
      await this.mailService.sendMail(dto);
      return { message: 'E-mail enviado com sucesso' };
    }
    return { message: 'Token inválido' };
  }
}
