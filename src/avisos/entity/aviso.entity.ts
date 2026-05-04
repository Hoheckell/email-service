import { Expose } from "class-transformer";
import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";
import { AvisoDto } from "../dto/aviso.dto";

@Entity('avisos')
export class Aviso {
  @PrimaryGeneratedColumn('uuid')
  id?: string | null;

  @Column({ type: 'varchar', nullable: false })
  turma_id: string;

  @Column({ type: 'varchar', nullable: false })
  titulo: string;

  @Column({ type: 'varchar', nullable: false })
  conteudo: string;

  @Column({ type: 'timestamptz', nullable: false })
  criado_em?: Date | null;

  @Column({ type: 'boolean', nullable: false })
  is_urgente: boolean;

  toDto(): AvisoDto {
    return AvisoDto.fromClass(this);
  }

  fromDto(dto: AvisoDto): Aviso {
    const entity = new Aviso();
    entity.id = dto.id;
    entity.turma_id = dto.turma_id;
    entity.titulo = dto.titulo;
    entity.conteudo = dto.conteudo;
    entity.criado_em = dto.criado_em;
    entity.is_urgente = dto.is_urgente;
    return entity;
  } 

  fromSupabase(data: any): Aviso {
    const entity = new Aviso();
    entity.id = data.id;
    entity.turma_id = data.turma_id;
    entity.titulo = data.titulo;
    entity.conteudo = data.conteudo;
    entity.criado_em = data.criado_em;
    entity.is_urgente = data.is_urgente;
    return entity;
  } 

  toJson(): string {
    return JSON.stringify(this);
  }

  fromJson(json: string): Aviso {
    const entityJson = JSON.parse(json);
    const entity = new Aviso();
    entity.id = entityJson.id;
    entity.turma_id = entityJson.turma_id;
    entity.titulo = entityJson.titulo;
    entity.conteudo = entityJson.conteudo;
    entity.criado_em = entityJson.criado_em;
    entity.is_urgente = entityJson.is_urgente;
    return entity;
  }
}


  
  