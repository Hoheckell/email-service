import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Turma } from '../../turmas/entity/turma.entity';
import { Optional } from '@nestjs/common';
import { MaterialDto } from '../dto/material.dto';

@Entity('materiais')
export class Material {
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  id?: number;

  @Column()
  link: string;

  @Column()
  nome: string;

  @Column()
  turma_id: number;

  // Relacionamento com a tabela intermediária
  @ManyToOne(() => Turma, (turma) => turma.materiais)
  @JoinColumn({ name: 'turma_id', referencedColumnName: 'id' })
  turma?: Turma;

  @Column()
  criadoEm?: Date;

  toDto(): MaterialDto {
    const dto = new MaterialDto();
    dto.id = this.id ?? 0;
    dto.link = this.link ?? '';
    dto.nome = this.nome;
    dto.turmaId = this.turma_id;
    return dto;
  }
}
