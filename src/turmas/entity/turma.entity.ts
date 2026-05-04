import {
  ManyToOne,
  Column,
  Entity,
  JoinColumn,
  PrimaryGeneratedColumn,
  OneToMany,
  ManyToMany,
} from 'typeorm';
import { Professor } from '../../professores/entity/professor.entity';
import { Evento } from '../../eventos/entity/evento.entity';
import { TurmaAluno } from './turma-aluno.entity';
import { Material } from '../../materiais/entity/material.entity';
import { TurmaDto } from '../dto/turma.dto';
import { Optional } from '@nestjs/common';
import { QuizEntity } from '../../quizz/entity/quizz.entity';

@Entity('turmas')
export class Turma {
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  id: number; // Continua int8

  @Column({ type: 'uuid', name: 'professor_id' })
  professorId: string; // AGORA É STRING (UUID)

  @Column()
  codigo: string;

  @Column()
  disciplina: string;

  @Optional()
  @Column()
  descricao?: string;

  @Column({ type: 'date', name: 'data_inicio' })
  dataInicio: Date;

  @Column({ type: 'date', name: 'data_fim' })
  dataFim: Date;

  @Column({ type: 'timestamp', name: 'criado_em' })
  criadoEm: Date;

  @Column({ default: 0 })
  icone: number;

  // Relacionamento (se estiver usando TypeORM relations)
  @ManyToOne(() => Professor, (professor) => professor.turmas)
  @JoinColumn({ name: 'professor_id', referencedColumnName: 'auth_id' })
  // Importante: referencedColumnName agora aponta para authId
  @Optional()
  professor?: Professor | null;

  @OneToMany(() => Evento, (evento) => evento.turma)
  eventos: Evento[] | [];

  @OneToMany(() => Material, (material) => material.turma)
  materiais: Material[] | [];

  @OneToMany(() => QuizEntity, (quizz) => quizz.turma)
  quizzes: QuizEntity[] | [];

  @ManyToMany(() => TurmaAluno, (turmaaluno) => turmaaluno.turmas)
  alunosMatriculados: TurmaAluno[] | [];

  toDto(): TurmaDto {
    const dto = new TurmaDto();
    dto.id = this.id;
    dto.codigo = this.codigo;
    dto.disciplina = this.disciplina;
    dto.dataInicio = this.dataInicio;
    dto.dataFim = this.dataFim;
    dto.professor = this.professor ? this.professor.toDto() : null;
    dto.descricao = this.descricao;
    dto.criadoEm = this.criadoEm;
    dto.icone = this.icone;
    dto.eventos = this.eventos ? this.eventos.map((evento) => evento.toDto()) : [];
    dto.materiais = this.materiais ? this.materiais.map((material) => material.toDto()) : [];
    dto.alunosMatriculados = this.alunosMatriculados ? this.alunosMatriculados.map((turmaAluno) => turmaAluno.toDto()) : [];
    dto.quizzes = this.quizzes ? this.quizzes.map((quizz) => quizz.toDto()) : [];
    return dto;
  }
}
