import { IsString, IsDate, IsNumber, IsOptional } from "class-validator";
import { TurmaDto } from "../../turmas/dto/turma.dto";
import { Evento } from "../entity/evento.entity";
import { EventoInterface } from "../interface/evento.interface";
import { Type } from "class-transformer";

export class EventoDto implements EventoInterface {
    @IsOptional()
    @IsNumber()
    id?: number | null;

    @IsOptional()
    @IsString()
    descricao: string;

    @IsOptional()
    @Type(() => Date)
    @IsDate()
    dataEvento: Date;

    @IsOptional()
    @IsString()
    turmaId: number;

    @IsOptional()
    turma?: TurmaDto;

    toEntity(): Evento {
        const entity = new Evento();
        entity.id = this.id;
        entity.descricao = this.descricao;
        entity.dataEvento = this.dataEvento;
        entity.turmaId = this.turmaId;
        entity.turma = this.turma ? this.turma.toEntity() : null;
        return entity;
    }

    static fromClass(evento: Evento): EventoDto {
        const dto = new EventoDto();
        dto.id = evento.id;
        dto.descricao = evento.descricao;
        dto.dataEvento = evento.dataEvento;
        dto.turmaId = evento.turmaId;
        dto.turma = evento.turma ? TurmaDto.fromClass(evento.turma) : undefined;
        return dto;
    }

    static fromJson(json: EventoInterface): EventoDto {
        const dto = new EventoDto();
        dto.id = json.id;
        dto.descricao = json.descricao ?? '';
        dto.dataEvento = json.dataEvento ?? new Date();
        dto.turmaId = json.turmaId ?? 0;
        dto.turma = json.turma ? TurmaDto.fromJson(json.turma) : undefined;
        return dto;
    }   

    static fromSupabase(data: any): EventoDto {
        const dto = new EventoDto();
        dto.id = data.id;
        dto.descricao = data.descricao;
        dto.dataEvento = data.data_evento;
        dto.turmaId = data.turma_id;
        dto.turma = TurmaDto.fromSupabase(data.turma);
        return dto;
    }
}