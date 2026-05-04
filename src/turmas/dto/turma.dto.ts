import { ProfessorDto } from '../../professores/dto/professor.dto';
import { EventoDto } from '../../eventos/dto/evento.dto';
import { MaterialDto } from '../../materiais/dto/material.dto';
import { Optional } from '@nestjs/common';
import { IsString, IsDate, IsNumber } from 'class-validator';
import { Turma } from '../entity/turma.entity';
import { TurmaAlunoDto } from './turma-aluno.dto';
import { TurmaInterface } from '../interface/turma.interface';
import { Transform, Type } from 'class-transformer';
import { QuizDto } from '../../quizz/dto/quizz.dto';

export class TurmaDto implements TurmaInterface {
  @Optional()
  @Transform(({ value }) => Number(value))
  @IsNumber()
  id: number;

  @Optional()
  @IsString()
  professorId: string;

  @Optional()
  @IsString()
  codigo: string;

  @Optional()
  @IsString()
  disciplina: string;

  @Optional()
  @IsString()
  descricao?: string;

  @Optional()
  @Type(() => Date)
  @IsDate()
  dataInicio: Date;

  @Optional()
  @Type(() => Date)
  @IsDate()
  dataFim: Date;

  @Optional()
  @Type(() => Date)
  @IsDate()
  criadoEm: Date;

  @Optional()
  @IsString()
  icone: number;

  @Optional()
  professor?: ProfessorDto | null;

  @Optional()
  eventos?: any[] | null;

  @Optional()
  materiais?: any[] | null;

  @Optional()
  alunosMatriculados?: any[] | null;

  @Optional()
  quizzes?: any[] | null;

  toEntity(): Turma {
    const entity = new Turma();
    entity.id = this.id;
    entity.professorId = this.professorId;
    entity.codigo = this.codigo;
    entity.disciplina = this.disciplina;
    entity.descricao = this.descricao ?? '';
    entity.dataInicio = this.dataInicio;
    entity.dataFim = this.dataFim;
    entity.criadoEm = this.criadoEm;
    entity.icone = this.icone;
    entity.professor = this.professor
      ? this.professor.toEntity(this.professorId)
      : null;
    entity.eventos = this.eventos
      ? this.eventos.map((evento) => evento.toEntity())
      : [];
    entity.materiais = this.materiais
      ? this.materiais.map((material) => material.toEntity())
      : [];
    entity.alunosMatriculados = this.alunosMatriculados
      ? this.alunosMatriculados.map((turmaAluno) => turmaAluno.toEntity())
      : [];
    entity.quizzes = this.quizzes
      ? this.quizzes.map((quizz) => quizz.toEntity())
      : [];
    return entity;
  }

  static fromClass(turma: Turma): TurmaDto {
    const dto = new TurmaDto();
    dto.id = turma.id;
    dto.professorId = turma.professorId;
    dto.codigo = turma.codigo;
    dto.disciplina = turma.disciplina;
    dto.descricao = turma.descricao ?? '';
    dto.dataInicio = turma.dataInicio;
    dto.dataFim = turma.dataFim;
    dto.criadoEm = turma.criadoEm;
    dto.icone = turma.icone;
    dto.professor = turma.professor
      ? ProfessorDto.fromClass(turma.professor)
      : null;
    dto.eventos = turma.eventos
      ? turma.eventos.map((evento) => EventoDto.fromClass(evento))
      : [];
    dto.materiais = turma.materiais
      ? turma.materiais.map((material) => MaterialDto.fromClass(material))
      : [];
    dto.alunosMatriculados = turma.alunosMatriculados
      ? turma.alunosMatriculados.map((turmaAluno) =>
          TurmaAlunoDto.fromClass(turmaAluno),
        )
      : [];
    dto.quizzes = turma.quizzes
      ? turma.quizzes.map((quizz) => QuizDto.fromClass(quizz))
      : [];
    return dto;
  }

  static fromJson(json: TurmaInterface): TurmaDto {
    const dto = new TurmaDto();
    dto.id = json.id;
    dto.professorId = json.professorId;
    dto.codigo = json.codigo;
    dto.disciplina = json.disciplina;
    dto.descricao = json.descricao ?? '';
    dto.dataInicio = json.dataInicio;
    dto.dataFim = json.dataFim;
    dto.criadoEm = json.criadoEm;
    dto.icone = json.icone;
    dto.professor = json.professor
      ? ProfessorDto.fromSupabase(json.professor)
      : null;
    dto.eventos = json.eventos_turma
      ? json.eventos_turma.map((evento) => EventoDto.fromSupabase(evento))
      : [];
    dto.materiais = json.materiais
      ? json.materiais.map((material) => MaterialDto.fromSupabase(material))
      : [];
    dto.alunosMatriculados = json.turmas_alunos
      ? json.turmas_alunos.map((turmaAluno) =>
          TurmaAlunoDto.fromSupabase(turmaAluno),
        )
      : [];
    dto.quizzes = json.quizzes
      ? json.quizzes.map((quizz) => QuizDto.fromSupabase(quizz))
      : [];
    return dto;
  }

  static fromSupabase(data: TurmaInterface): TurmaDto {
    const dto = new TurmaDto();
    dto.id = data.id;
    dto.professorId = data.professorId;
    dto.codigo = data.codigo;
    dto.disciplina = data.disciplina;
    dto.descricao = data.descricao ?? '';
    dto.dataInicio = data.dataInicio;
    dto.dataFim = data.dataFim;
    dto.criadoEm = data.criadoEm;
    dto.icone = data.icone;
    dto.professor = data.professor
      ? ProfessorDto.fromSupabase(data.professor)
      : null;
    dto.eventos = data.eventos_turma
      ? data.eventos_turma.map((evento: EventoDto) =>
          EventoDto.fromSupabase(evento),
        )
      : [];
    dto.materiais = data.materiais
      ? data.materiais.map((material: MaterialDto) =>
          MaterialDto.fromSupabase(material),
        )
      : [];
    dto.alunosMatriculados = data.turmas_alunos
      ? data.turmas_alunos.map((turmaAluno: TurmaAlunoDto) =>
          TurmaAlunoDto.fromSupabase(turmaAluno),
        )
      : [];
    dto.quizzes = data.quizzes
      ? data.quizzes.map((quizz: QuizDto) => QuizDto.fromSupabase(quizz))
      : [];
    return dto;
  }
}
