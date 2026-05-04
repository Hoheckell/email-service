import { ITentativa } from "../interface/interfaces";
import { StatusTentativaEnum } from "../../enums/status-tentativa.enum";
import { TentativaEntity } from "../entity/tentativa.entity";
import { IsEnum, IsNotEmpty, IsOptional } from "class-validator";
import { AlunoDto } from "../../alunos/dto/aluno.dto";
import { QuizDto } from "./quizz.dto";

export class TentativaDto implements ITentativa {
  @IsOptional()
  id?: string;

  @IsNotEmpty({ message: 'Quiz é obrigatório' })
  quiz_id: string;

  @IsNotEmpty({ message: 'Aluno é obrigatório' })
  aluno_id: string;

  @IsEnum(StatusTentativaEnum, { message: 'Status inválido' })
  status: StatusTentativaEnum;

  @IsOptional()
  nota_final?: number;

  @IsOptional()
  iniciada_em?: Date;

  @IsOptional()
  concluida_em?: Date;

  @IsNotEmpty({ message: 'Respostas são obrigatórias' })
  respostas: Record<string, any>;

  @IsOptional()
  aluno?: AlunoDto; 

  @IsOptional()
  quizzes?: QuizDto; 

  static fromClass(partial: Partial<TentativaDto>): TentativaDto {
    const dto = new TentativaDto();
    Object.assign(dto, partial);
    return dto;
  }

  static fromJson(json: string | object): TentativaDto {
    const dto = new TentativaDto();
    Object.assign(dto, json);
    return dto;
  }

  toEntity(): TentativaEntity {
    const entity = new TentativaEntity();
    entity.id = this.id ? this.id : undefined;
    entity.quiz_id = this.quiz_id;
    entity.aluno_id = this.aluno_id;
    entity.status = this.status;
    entity.nota_final = this.nota_final ?? 0;
    entity.concluida_em = this.concluida_em ?? null;
    entity.respostas = this.respostas;
    entity.aluno = this.aluno ? this.aluno.toEntity() : undefined;
    entity.quiz = this.quizzes ? this.quizzes.toEntity() : undefined;
    return entity;
  }

  static fromSupabase(data: any): TentativaDto {
    const dto = new TentativaDto();
    dto.id = data.id;
    dto.quiz_id = data.quiz_id;
    dto.aluno_id = data.aluno_id;
    dto.status = data.status;
    dto.nota_final = data.nota_final;
    dto.iniciada_em = data.iniciada_em ? new Date(data.iniciada_em) : undefined;
    dto.concluida_em = data.concluida_em ? new Date(data.concluida_em) : undefined;
    dto.respostas = data.respostas;
    dto.aluno = data.aluno ? AlunoDto.fromSupabase(data.aluno) : undefined;
    dto.quizzes = data.quizzes ? QuizDto.fromSupabase(data.quizzes) : undefined;
    return dto;
  }
}