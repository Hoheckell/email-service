import { Aviso } from "../entity/aviso.entity";
import { AvisoInterface } from "../interface/aviso.interface";
import { IsBoolean, IsDate, IsNumber, IsOptional, IsString } from "class-validator";

export class AvisoDto implements AvisoInterface {

    @IsOptional()
    @IsString()
    id?: string | null;
    
    @IsString()
    turma_id: string;
    
    @IsString()
    titulo: string;
    
    @IsString()
    conteudo: string;
    
    @IsOptional()
    @IsDate()
    criado_em?: Date | null;
    
    @IsBoolean()
    is_urgente: boolean;

    static fromClass(aviso: Aviso): AvisoDto {
        const dto = new AvisoDto();
        dto.id = aviso.id;
        dto.turma_id = aviso.turma_id;
        dto.titulo = aviso.titulo;
        dto.conteudo = aviso.conteudo;
        dto.criado_em = aviso.criado_em;
        dto.is_urgente = aviso.is_urgente;
        return dto;
    }

    static fromJson(json: string): AvisoDto {
        const dto = new AvisoDto();
        const dtoJson = JSON.parse(json);
        dto.id = dtoJson.id;
        dto.turma_id = dtoJson.turma_id;
        dto.titulo = dtoJson.titulo;
        dto.conteudo = dtoJson.conteudo;
        dto.criado_em = dtoJson.criado_em;
        dto.is_urgente = dtoJson.is_urgente;
        return dto;
    }

    toJson(): string {
        return JSON.stringify(this);
    }

    static fromSupabase(data: any): AvisoDto {
        const dto = new AvisoDto();
        dto.id = data.id;
        dto.turma_id = data.turma_id;
        dto.titulo = data.titulo;
        dto.conteudo = data.conteudo;
        dto.criado_em = data.criado_em;
        dto.is_urgente = data.is_urgente;
        return dto;
    }
}