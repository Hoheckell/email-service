// src/auth/dto/login.dto.ts
import { IsEmail, IsNotEmpty, IsString, IsEnum } from 'class-validator';
import { UserRoleEnum } from '../../auth/enum/enums';
import { Optional } from '@nestjs/common';
import { Aluno } from '../../alunos/entity/aluno.entity';
import { AlunoInterface } from '../interface/aluno.interface';


export class AlunoDto {
  @Optional()
  @IsString()
  id?: string;

  @Optional()
  @IsString()
  authId?: string;

  @Optional()
  @IsEmail({}, { message: 'E-mail inválido' })
  email?: string;
  
  @Optional()
  @IsEmail()
  oldEmail?: string;

  @IsNotEmpty({ message: 'Nome é obrigatória' })
  @IsString()
  nome: string;

  @IsNotEmpty({ message: 'Whatsapp é obrigatória' })
  @IsString()
  whatsapp: string;

  @Optional()
  @IsNotEmpty({ message: 'Código é obrigatória' })
  @IsString()
  codigo: string;

  @IsString()
  ativo: boolean;

  @Optional()
  @IsString()
  avatar: string;

  @Optional()
  @IsEnum(UserRoleEnum, { message: 'Role deve ser ALUNO ou PROFESSOR' })
  role: UserRoleEnum;

  @Optional()
  @IsString()
  token?: string;

  static fromClass(aluno: Aluno, role: UserRoleEnum = UserRoleEnum.ALUNO): AlunoDto {
    const dto = new AlunoDto();
    dto.nome = aluno.nome;
    dto.email = aluno.email;
    dto.whatsapp = aluno.whatsapp;
    dto.ativo = aluno.ativo;
    dto.avatar = aluno.avatar;
    dto.codigo = aluno.codigo;
    dto.role = role;
    dto.id = aluno?.id;
    return dto;
  }

  toEntity(): Aluno {
    const entity = new Aluno();
    entity.id = this.id!;
    entity.authId = this.authId!;
    entity.nome = this.nome;
    entity.codigo = this.codigo;
    entity.email = this.email ?? '';
    entity.ativo = this.ativo;
    entity.avatar = this.avatar;
    entity.whatsapp = this.whatsapp;
    return entity;
  }

  static fromJson(json: AlunoInterface, role: UserRoleEnum = UserRoleEnum.ALUNO): AlunoDto {
    const dto = new AlunoDto();
    dto.authId = json.authId ?? json.auth_id ?? '';
    dto.nome = json.nome;
    dto.email = json.email;
    dto.whatsapp = json.whatsapp;
    dto.ativo = json.ativo;
    dto.avatar = json.avatar ?? '';
    dto.codigo = json.codigo ?? '';
    dto.role = role;
    dto.token = json.token ?? '';
    dto.id = json?.id;
    return dto;
  }

  static fromSupabase(data: any, role: UserRoleEnum = UserRoleEnum.ALUNO): AlunoDto {
    const dto = new AlunoDto();
    dto.authId = data.auth_id;
    dto.nome = data.nome;
    dto.email = data.email;
    dto.whatsapp = data.whatsapp;
    dto.ativo = data.ativo;
    dto.avatar = data.avatar ?? '';
    dto.codigo = data.codigo ?? '';
    dto.role = role;
    dto.id = data.id!;
    return dto;
  }
}
