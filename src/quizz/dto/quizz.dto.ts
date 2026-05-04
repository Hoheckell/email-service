import { IQuiz } from "../interface/interfaces";
import { QuestaoDto } from "./questao.dto";
import { QuizEntity } from "../entity/quizz.entity";
import { TurmaDto } from "../../turmas/dto/turma.dto";
import { StatusEnum } from "../../auth/enum/enums";
import { TentativaDto } from "./tentativa.dto";
import { IsEnum, IsNotEmpty, IsOptional } from "class-validator";

export class QuizDto implements IQuiz {
  @IsOptional()
  id?: string | null;
  
  @IsNotEmpty({ message: 'Turma é obrigatória' })
  turma_id: string;

  @IsNotEmpty({ message: 'Título é obrigatório' })
  titulo: string;

  @IsOptional()
  data_conclusao?: Date | null;

  @IsOptional()
  criado_em?: Date | null;

  @IsOptional()
  atualizado_em?: Date | null;

  @IsNotEmpty({ message: 'Questões são obrigatórias' })
  questoes: QuestaoDto[];

  @IsOptional()
  turma?: TurmaDto | null;

  @IsEnum(StatusEnum, { message: 'Status inválido' })
  status: StatusEnum;

  @IsOptional()
  tentativas?: TentativaDto[] | null;

  @IsOptional()
  totalTentativas?: number | null;

  static fromClass(partial: Partial<QuizDto>): QuizDto {
    const dto = new QuizDto();
    Object.assign(dto, partial);
    if (partial.questoes) {
      dto.questoes = partial.questoes.map((q) => QuestaoDto.fromClass(q));
    }
    return dto;
  }

  static fromJson(json: string): QuizDto {
    const dto = new QuizDto();
    const jsonString = JSON.stringify(json);
    Object.assign(dto, JSON.parse(jsonString.replace(/'/g, '"')));
    if (dto.questoes) {
      const questaodto =  new QuestaoDto();
      for (const questao of dto.questoes) {
        Object.assign(QuestaoDto, questao);
        dto.questoes = dto.questoes.map((q) => QuestaoDto.fromClass(q));
      }
    }
    if (dto.tentativas) {
      const tentativadto =  new TentativaDto();
      for (const tentativa of dto.tentativas) {
        Object.assign(TentativaDto, tentativa);
        dto.tentativas = dto.tentativas.map((t) => TentativaDto.fromClass(t));
    }
    if (dto.turma) {
      dto.turma = TurmaDto.fromJson(dto.turma);
    } 
  }
    return dto;
}

  toEntity(): QuizEntity {
    const entity = new QuizEntity();
    entity.id = this.id ? this.id : undefined;
    entity.turma_id = this.turma_id;
    entity.titulo = this.titulo;
    entity.data_conclusao = this.data_conclusao ?? null;
    entity.status = this.status;
    entity.questoes = this.questoes ? this.questoes.map((q) => {
        const questaoInstanciada = q instanceof QuestaoDto ? q : QuestaoDto.fromClass(q);
        return questaoInstanciada.toEntity();
    }) : [];
    return entity;
  }

  static fromSupabase(data: any): QuizDto {
    const dto = new QuizDto();
    dto.id = data.id;
    dto.turma_id = data.turma_id; 
    dto.titulo = data.titulo;
    dto.data_conclusao = data.data_conclusao ? new Date(data.data_conclusao) : undefined;
    dto.criado_em = data.criado_em ? new Date(data.criado_em) : undefined;
    dto.atualizado_em = data.atualizado_em ? new Date(data.atualizado_em) : undefined;
    dto.status = data.status;
    dto.turma = data.turmas ? TurmaDto.fromSupabase(data.turmas) : undefined;
    dto.tentativas = data.tentativas ? data.tentativas.map((t: any) => TentativaDto.fromSupabase(t)) : undefined;
    dto.totalTentativas = data.totalTentativas ? data.totalTentativas : data.tentativas ? data.tentativas.length : 0;

    // Tradução em cascata das relações
    if (data.questoes) {
        dto.questoes = data.questoes.map((q: any) => QuestaoDto.fromSupabase(q));
    }
    
    return dto;
  }
}