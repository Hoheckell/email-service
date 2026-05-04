import { Entity, Column, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Turma } from '../../turmas/entity/turma.entity';
import { ProfessorDto } from '../dto/professor.dto';
import { UserRoleEnum } from '../../auth/enum/enums';
import { Optional } from '@nestjs/common';
@Entity('professores')
export class Professor {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'auth_id', type: 'uuid', unique: true })
  authId: string;

  @Column()
  nome: string;

  @Optional()
  @Column()
  codigo?: string;

  @Column({ default: true })
  ativo: boolean;

  @Column()
  whatsapp: string;

  @Column({ unique: true })
  email: string;

  @Optional()
  @Column({ name: 'avatar', nullable: true })
  avatar?: string;

  // Relacionamento OneToMany
  // O TypeORM saberá unir isso porque na entidade Turma definiremos o JoinColumn
  @OneToMany(() => Turma, (turma) => turma.professor)
  turmas: Turma[];

  toDto(): ProfessorDto {
    const dto = new ProfessorDto();
    dto.nome = this.nome;
    dto.email = this.email;
    dto.whatsapp = this.whatsapp;
    dto.ativo = this.ativo;
    dto.avatar = this.avatar;
    dto.codigo = this.codigo;
    dto.role = UserRoleEnum.PROFESSOR;
    dto.id = this.id!;
    return dto;
  }
}
