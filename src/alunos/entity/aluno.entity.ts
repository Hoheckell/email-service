import { Entity, Column, ManyToMany, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { TurmaAluno } from '../../turmas/entity/turma-aluno.entity';
import { AlunoDto } from '../../alunos/dto/aluno.dto';
import { UserRoleEnum } from '../../auth/enum/enums';
import { TentativaEntity } from '../../quizz/entity/tentativa.entity';

@Entity('alunos')
export class Aluno {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'auth_id', type: 'uuid', unique: true })
  authId: string;

  @Column()
  nome: string;

  @Column()
  codigo: string;

  @Column({ default: true })
  ativo: boolean;

  @Column()
  whatsapp: string;

  @Column()
  avatar: string;

  @Column({ unique: true })
  email: string;

  // Relacionamento com a tabela intermediária
  @ManyToMany(() => TurmaAluno, (turmaAluno) => turmaAluno.alunos)
  turmasMatriculadas: TurmaAluno[];

  @OneToMany(() => TentativaEntity, (tentativa) => tentativa.aluno)
  tentativas: TentativaEntity[];

  toDto(): AlunoDto {
    const dto = new AlunoDto();
    dto.nome = this.nome;
    dto.email = this.email;
    dto.whatsapp = this.whatsapp;
    dto.ativo = this.ativo;
    dto.avatar = this.avatar;
    dto.codigo = this.codigo;
    dto.role = UserRoleEnum.ALUNO;
    return dto;
  }
}
