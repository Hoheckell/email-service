import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Turma } from '../../turmas/entity/turma.entity';
import { EventoDto } from '../dto/evento.dto';

@Entity('eventos_turma')
export class Evento {
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  id?: number | null;

  @Column({ type: 'varchar', nullable: false })
  descricao: string;

  @Column({ type: 'bigint', nullable: false, name: 'turma_id' })
  turmaId: number;

  @Column({ type: 'timestamp', nullable: false, name: 'data_evento' })
  dataEvento: Date;

  // Relacionamento com a tabela intermediária
  @ManyToOne(() => Turma, (turma) => turma.eventos)
  turma?: Turma | null;

  toDto(): EventoDto {
    const dto = new EventoDto();
    dto.id = this.id;
    dto.descricao = this.descricao;
    dto.turmaId = this.turmaId;
    dto.dataEvento = this.dataEvento;
    return dto;
  }
}
