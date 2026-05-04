import { Body, Controller, Post, Headers, HttpException, HttpStatus } from '@nestjs/common';
import { VerificationService } from './verification.service';
import 'dotenv/config';
import { UserRoleEnum } from '../auth/enum/enums';

@Controller('verification')
export class VerificationController {
  constructor(private readonly service: VerificationService) {}
  @Post('check')
  check(
    @Body() body: { email: string; codigo: string; role: UserRoleEnum },
    @Headers('x-token') token: string, @Headers('authorization') authHeader: string
  ) {
    if (token != process.env.X_TOKEN || !authHeader) {
      throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
    }
    const authToken = authHeader.replace('Bearer ', '');
    try {
      return this.service.verifyCode(body.email, body.codigo, body.role, authToken);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
}
