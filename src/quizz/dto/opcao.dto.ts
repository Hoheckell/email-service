import { IOpcao } from "../interface/interfaces";
import { OpcaoEntity } from "../entity/opcao.entity";
import { IsEnum, IsNotEmpty, IsOptional } from "class-validator";

export class OpcaoDto implements IOpcao {
  @IsOptional()
  id?: string;

  @IsNotEmpty({ message: 'Questão é obrigatória' })
  questao_id: string;

  @IsNotEmpty({ message: 'Texto é obrigatório' })
  texto: string;

  @IsNotEmpty({ message: 'É correta é obrigatória' })
  is_correta: boolean;

  @IsNotEmpty({ message: 'Ordem é obrigatória' })
  ordem: number;

  static fromClass(partial: Partial<OpcaoDto>): OpcaoDto {
    const dto = new OpcaoDto();
    Object.assign(dto, partial);
    return dto;
  }

  toEntity(): OpcaoEntity {
    const entity = new OpcaoEntity();
    entity.id = this.id ? this.id : undefined;
    entity.questao_id = this.questao_id;
    entity.texto = this.texto;
    entity.is_correta = this.is_correta;
    entity.ordem = this.ordem;
    return entity;
  }

  static fromSupabase(data: any): OpcaoDto {
    const dto = new OpcaoDto();
    dto.id = data.id;
    dto.questao_id = data.questao_id; 
    dto.texto = data.texto;
    dto.is_correta = data.is_correta; 
    dto.ordem = data.ordem;
    return dto;
  }

  static fromJson(json: string): OpcaoDto {
    const dto = new OpcaoDto();
    Object.assign(dto, JSON.parse(json));
    return dto;
  }
}