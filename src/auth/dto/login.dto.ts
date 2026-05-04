// src/auth/dto/login.dto.ts
import { IsEmail, IsNotEmpty, IsString, IsEnum } from 'class-validator';
import { UserRoleEnum } from '../enum/enums';


export class LoginDto {
  @IsEmail({}, { message: 'E-mail inválido' })
  email: string;

  @IsNotEmpty({ message: 'Senha é obrigatória' })
  @IsString()
  password: string;

  @IsEnum(UserRoleEnum, { message: 'Role deve ser ALUNO ou PROFESSOR' })
  role: UserRoleEnum;
}
