import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm'; 
import { QuestaoEntity } from './questao.entity';
import { OpcaoDto } from '../dto/opcao.dto';
import { Expose } from 'class-transformer';

@Entity('opcoes')
export class OpcaoEntity {
  @PrimaryGeneratedColumn('uuid')
  id?: string;

  @Column({ name: 'questao_id', type: 'uuid' })
  questao_id: string;

  @Column({ type: 'text' })
  texto: string;

  @Column({ name: 'is_correta', type: 'boolean', default: false })
  is_correta: boolean;

  @Column({ type: 'int' })
  ordem: number;

  @ManyToOne(() => QuestaoEntity, (questao) => questao.opcoes, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'questao_id' })
  questao: QuestaoEntity;

  toDto(): OpcaoDto {
    return OpcaoDto.fromClass({
      id: this.id,
      questao_id: this.questao_id,
      texto: this.texto,
      is_correta: this.is_correta,
      ordem: this.ordem,
    });
  }
}