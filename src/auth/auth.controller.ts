// src/auth/auth.controller.ts
import { Controller, Post, Body, HttpCode, HttpStatus, Headers, HttpException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { SignupDto } from './dto/signup.dto';
import { AlunoDto } from '../alunos/dto/aluno.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post('login')
  async login(@Body() loginDto: LoginDto, @Headers('x-token') token: string): Promise< {
    access_token: string;
    role: string;
    user: any;
}> {
    if (token != process.env.X_TOKEN) {
      throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
    } else {
      var login = await this.authService.login(
        loginDto.email,
        loginDto.password,
        loginDto.role,
      );
    }
    return login;
  }

  @HttpCode(HttpStatus.OK)
  @Post('signup')
  async signup(@Body() signupDto: SignupDto, @Headers('x-token') token: string): Promise<AlunoDto | { error: string }> {
    if (token != process.env.X_TOKEN) {
      console.log('Unauthorized');
      throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
    } else {
      var signup = await this.authService.signup(signupDto);
      if ((signup as any).error) {
        throw new HttpException((signup as any).error, HttpStatus.INTERNAL_SERVER_ERROR);
      }
      return signup;
    }
  }


  @HttpCode(HttpStatus.OK)
  @Post('loginadmin')
  async loginadmin(@Body() loginDto: LoginDto, @Headers('x-token') token: string): Promise< {
    access_token: string;
    role: string;
    user: any;
}> {
    if (token != process.env.X_TOKEN) {
      throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
    } else {
      var login = await this.authService.login(
        loginDto.email,
        loginDto.password,
        loginDto.role,
      );
    }
    return login;
  }
}
