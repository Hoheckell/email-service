// src/auth/dto/login.dto.ts
import { IsEmail, IsNotEmpty, IsString, IsEnum } from 'class-validator';
import { UserRoleEnum } from '../../auth/enum/enums';
import { Optional } from '@nestjs/common';
import { Professor } from '../entity/professor.entity';
import { ProfessorInterface } from '../interface/professor.interface';

export class ProfessorDto implements ProfessorInterface {

  @Optional()
  @IsString()
  id?: string;

  @Optional()
  @IsString()
  authId?: string;

  @Optional()
  @IsEmail()
  oldEmail?: string;

  @IsNotEmpty({ message: 'Email é obrigatória' })
  @IsEmail({}, { message: 'E-mail inválido' })
  email: string;

  @IsNotEmpty({ message: 'Nome é obrigatória' })
  @IsString()
  nome: string;

  @IsNotEmpty({ message: 'Whatsapp é obrigatória' })
  @IsString()
  whatsapp: string;

  @Optional()
  @IsNotEmpty({ message: 'Código é obrigatória' })
  @IsString()
  codigo?: string;

  @IsString()
  ativo: boolean;

  @Optional()
  @IsString()
  avatar?: string;

  @Optional()
  @IsEnum(UserRoleEnum, { message: 'Role deve ser ALUNO ou PROFESSOR' })
  role: UserRoleEnum;
  
  @Optional()
  @IsString()
  token?: string;

  static fromClass(professor: Professor): ProfessorDto {
    const dto = new ProfessorDto();
    dto.nome = professor.nome;
    dto.email = professor.email;
    dto.whatsapp = professor.whatsapp;
    dto.ativo = professor.ativo;
    dto.avatar = professor.avatar ?? '';
    dto.codigo = professor.codigo ?? '';
    dto.role = UserRoleEnum.PROFESSOR;
    return dto;
  }

  toEntity(authId: string): Professor {
    const entity = new Professor();
    entity.authId = authId;
    entity.nome = this.nome;
    entity.codigo = this.codigo;
    entity.email = this.email;
    entity.ativo = this.ativo;
    entity.avatar = this.avatar;
    entity.whatsapp = this.whatsapp;
    return entity;
  }

  static fromJson(json: ProfessorInterface): ProfessorDto {
    const dto = new ProfessorDto();
    dto.authId = json.authId ?? json.auth_id ?? '';
    dto.nome = json.nome;
    dto.email = json.email;
    dto.whatsapp = json.whatsapp;
    dto.ativo = json.ativo;
    dto.avatar = json.avatar ?? '';
    dto.codigo = json.codigo ?? '';
    dto.role = UserRoleEnum.PROFESSOR;
    dto.token = json.token ?? '';
    return dto;
  }

  static fromSupabase(data: any): ProfessorDto {
    const dto = new ProfessorDto();
    dto.authId = data.auth_id;
    dto.nome = data.nome;
    dto.email = data.email;
    dto.whatsapp = data.whatsapp;
    dto.ativo = data.ativo;
    dto.avatar = data.avatar ?? '';
    dto.codigo = data.codigo ?? '';
    dto.role = UserRoleEnum.PROFESSOR;
    return dto;
  }
}
