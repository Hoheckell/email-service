import { Optional } from "@nestjs/common";
import { IsString } from "class-validator";
import { AlunoDto } from "../../alunos/dto/aluno.dto";
import { TurmaDto } from "../../turmas/dto/turma.dto";
import { TurmaAluno } from "../entity/turma-aluno.entity";
import { TurmaAlunoInterface } from "../interface/turma-aluno.interface";

export class TurmaAlunoDto {
    @Optional()
    @IsString()
    id: number;
    
    @Optional()
    @IsString()
    turmaId: number;
    
    @Optional()
    @IsString()
    alunoId: string;
    
    @Optional()
    @IsString()
    alunos: AlunoDto[];
    
    @Optional()
    @IsString()
    turmas: TurmaDto[];

    toEntity(): TurmaAluno {
        const entity = new TurmaAluno();
        entity.id = this.id;
        entity.turmaId = this.turmaId;
        entity.alunoId = this.alunoId;
        entity.alunos = this.alunos.map((aluno) => aluno.toEntity());
        entity.turmas = this.turmas.map((turma) => turma.toEntity());
        return entity;
    }

    static fromClass(turmaAluno: TurmaAluno): TurmaAlunoDto {
        const dto = new TurmaAlunoDto();
        dto.id = turmaAluno.id;
        dto.turmaId = turmaAluno.turmaId;
        dto.alunoId = turmaAluno.alunoId;
        dto.alunos = turmaAluno.alunos.map((aluno) => AlunoDto.fromClass(aluno));
        dto.turmas = turmaAluno.turmas.map((turma) => TurmaDto.fromClass(turma));
        return dto;
    }

    static fromJson(json: TurmaAlunoInterface): TurmaAlunoDto {
        const dto = new TurmaAlunoDto();
        dto.id = json.id;
        dto.turmaId = json.turmaId;
        dto.alunoId = json.alunoId;
        dto.alunos = json.alunos.map((aluno) => AlunoDto.fromJson(aluno));
        dto.turmas = json.turmas.map((turma) => TurmaDto.fromJson(turma));
        return dto;
    }

    static fromSupabase(data: any): TurmaAlunoDto {
        const dto = new TurmaAlunoDto();
        dto.id = data.id;
        dto.turmaId = data.turma_id;
        dto.alunoId = data.aluno_id;
        dto.alunos = data.alunos ? data.alunos.map((aluno: AlunoDto) => AlunoDto.fromSupabase(aluno)) : [];
        dto.turmas = data.turmas ? data.turmas.map((turma: TurmaDto) => TurmaDto.fromSupabase(turma)) : [];
        return dto;
    }
}