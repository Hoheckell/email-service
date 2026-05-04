import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  JoinColumn,
  ManyToMany,
} from 'typeorm';
import { Turma } from './turma.entity';
import { Aluno } from '../../alunos/entity/aluno.entity';
import { TurmaAlunoDto } from '../dto/turma-aluno.dto';

@Entity('turmas_alunos')
export class TurmaAluno {
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  id: number;

  @Column({ type: 'bigint', name: 'turma_id' })
  turmaId: number; // Continua int8

  @Column({ type: 'uuid', name: 'aluno_id' })
  alunoId: string; // AGORA É STRING (UUID)

  @ManyToMany(() => Aluno)
  @JoinColumn({ name: 'aluno_id', referencedColumnName: 'authId' })
  alunos: Aluno[];

  @ManyToMany(() => Turma)
  @JoinColumn({ name: 'turma_id', referencedColumnName: 'id' })
  turmas: Turma[];

  toDto(): TurmaAlunoDto {
    const dto = new TurmaAlunoDto();
    dto.id = this.id;
    dto.turmaId = this.turmaId;
    dto.alunoId = this.alunoId;
    dto.alunos = this.alunos.map((aluno) => aluno.toDto());
    dto.turmas = this.turmas.map((turma) => turma.toDto());
    return dto;
  }
}
