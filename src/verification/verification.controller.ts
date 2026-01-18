import { Body, Controller, Post, Headers } from '@nestjs/common';
import { VerificationService } from './verification.service';
import 'dotenv/config';

@Controller('verification')
export class VerificationController {
  constructor(private readonly service: VerificationService) {}
  @Post('check')
  check(
    @Body() body: { email: string; codigo: string; tipo: number },
    @Headers('x-token') token: string,
  ) {
    console.log(token, process.env.X_TOKEN, token == process.env.X_TOKEN);
    if (token == process.env.X_TOKEN) {
      return this.service.verifyCode(body.email, body.codigo, body.tipo);
    }
    return { valid: false };
  }
}
