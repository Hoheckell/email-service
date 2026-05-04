import { IQuestao } from "../interface/interfaces";
import { OpcaoDto } from "./opcao.dto";
import { QuestaoEntity } from "../entity/questao.entity";
import { TipoQuestaoEnum } from "../../auth/enum/enums";
import { IsEnum, IsNotEmpty, IsOptional } from "class-validator";

export class QuestaoDto implements IQuestao {
  @IsOptional()
  id?: string;

  @IsNotEmpty({ message: 'Quiz é obrigatório' })
  quiz_id: string;

  @IsEnum(TipoQuestaoEnum, { message: 'Tipo de questão inválido' })
  tipo: TipoQuestaoEnum;

  @IsNotEmpty({ message: 'Enunciado é obrigatório' })
  enunciado: string;

  @IsNotEmpty({ message: 'Ordem é obrigatória' })
  ordem: number;

  @IsNotEmpty({ message: 'Pontuação é obrigatória' })
  pontuacao_peso: number;

  @IsNotEmpty({ message: 'Configuração é obrigatória' })
  configuracao: Record<string, any>;

  @IsOptional()
  opcoes?: OpcaoDto[]; // Relacionamento opcional no DTO

  static fromClass(partial: Partial<QuestaoDto>): QuestaoDto {
    const dto = new QuestaoDto();
    Object.assign(dto, partial);
    if (partial.opcoes) {
      dto.opcoes = partial.opcoes.map((o) => OpcaoDto.fromClass(o));
    }
    return dto;
  } 

  toEntity(): QuestaoEntity {
    const entity = new QuestaoEntity();
    entity.id = this.id ? this.id : undefined;
    entity.quiz_id = this.quiz_id;
    entity.tipo = this.tipo;
    entity.enunciado = this.enunciado;
    entity.ordem = this.ordem;
    entity.pontuacao_peso = this.pontuacao_peso;
    entity.configuracao = this.configuracao;
    if (this.opcoes) {
      entity.opcoes = this.opcoes.map((o) => o.toEntity());
    }
    return entity;
  }

  static fromSupabase(data: any): QuestaoDto {
    const dto = new QuestaoDto();
    dto.id = data.id;
    dto.quiz_id = data.quiz_id; 
    dto.tipo = data.tipo;
    dto.enunciado = data.enunciado;
    dto.pontuacao_peso = data.pontuacao_peso;
    dto.configuracao = data.configuracao;

    // Tradução em cascata das relações
    if (data.opcoes) {
        dto.opcoes = data.opcoes.map((o: any) => OpcaoDto.fromSupabase(o));
    }
    
    return dto;
  }

  static fromJson(json: string): QuestaoDto {
    const dto = new QuestaoDto();
    Object.assign(dto, JSON.parse(json));
    if (dto.opcoes) {
      const opcaoDto =  new OpcaoDto();
      for (const opcao of dto.opcoes) {
        Object.assign(OpcaoDto, opcao);
        dto.opcoes = dto.opcoes.map((q) => OpcaoDto.fromClass(q));
      }
    }
    return dto;
  }
}