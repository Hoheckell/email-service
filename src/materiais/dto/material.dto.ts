import { Optional } from "@nestjs/common";
import { IsDate, IsNumber, IsString } from "class-validator";
import { TurmaDto } from "../../turmas/dto/turma.dto";
import { Material } from "../entity/material.entity";
import { MaterialInterface } from "../interface/material.interface";
import { Turma } from "../../turmas/entity/turma.entity";
import { Transform, Type } from "class-transformer";


export class MaterialDto implements MaterialInterface {
    @Optional()
    @Transform(({ value }) => Number(value))
    @IsNumber()
    id: number;

    @Optional()
    @IsString()
    link: string;

    @Optional()
    @IsString()
    nome: string;

    @Optional()
    @Transform(({ value }) => Number(value))
    @IsNumber()
    turmaId: number;

    @Optional()
    turma?: any;

    @Optional()
    file?: any;

    @Optional()
    @Type(() => Date)
    @IsDate()
    criadoEm?: Date;

    toEntity(): Material {
        const entity = new Material();
        entity.id = this.id;
        entity.link = this.link;
        entity.nome = this.nome;
        entity.turma_id = this.turmaId;
        entity.turma = this.turma.toEntity();
        entity.criadoEm = this.criadoEm;
        return entity;
    }

    static fromClass(material: Material): MaterialDto {
        const dto = new MaterialDto();
        dto.id = material.id ?? 0;
        dto.link = material.link ?? '';
        dto.nome = material.nome;
        dto.turmaId = material.turma_id;
        dto.turma = TurmaDto.fromClass(material.turma ?? new Turma());
        dto.criadoEm = material.criadoEm;
        return dto;
    }

    static fromJson(json: MaterialInterface): MaterialDto {
        const dto = new MaterialDto();
        dto.id = json.id ?? 0;
        dto.link = json.link ?? '';
        dto.nome = json.nome ?? '';
        dto.turmaId = json.turmaId ?? 0;
        dto.turma = TurmaDto.fromJson(json.turma ?? new TurmaDto());
        dto.criadoEm = json.criadoEm;
        return dto;
    }

    static fromSupabase(data: any): MaterialDto {
        const dto = new MaterialDto();
        dto.id = data.id;
        dto.link = data.link ?? '';
        dto.nome = data.nome;
        dto.turmaId = data.turma_id;
        dto.turma = data.turma ? TurmaDto.fromSupabase(data.turma) : null;
        dto.criadoEm = data.criado_em;
        return dto;
    }
}