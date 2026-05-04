// src/auth/dto/login.dto.ts
import { IsEmail, IsNotEmpty, IsString, IsEnum, IsBoolean, IsOptional } from 'class-validator';
import { UserRoleEnum } from '../enum/enums';

export class SignupDto {
  @IsEmail({}, { message: 'E-mail inválido' })
  email: string;

  @IsNotEmpty({ message: 'Senha é obrigatória' })
  @IsString()
  senha: string;

  @IsNotEmpty({ message: 'Nome é obrigatória' })
  @IsString()
  nome: string;

  @IsNotEmpty({ message: 'Whatsapp é obrigatória' })
  @IsString()
  whatsapp: string;

  @IsNotEmpty({ message: 'Código é obrigatória' })
  @IsString()
  codigo: string;

  @IsOptional()
  @IsString()
  confirmationCode?: string;

  @IsBoolean()
  ativo: boolean;

  @IsEnum(UserRoleEnum, { message: 'Role deve ser ALUNO ou PROFESSOR' })
  role: UserRoleEnum;
}
