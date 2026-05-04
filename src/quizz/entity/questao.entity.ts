import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { QuizEntity } from './quizz.entity';
import { OpcaoEntity } from './opcao.entity';
import { QuestaoDto } from '../dto/questao.dto';
import { TipoQuestaoEnum } from '../../auth/enum/enums';

@Entity('questoes')
export class QuestaoEntity {
  @PrimaryGeneratedColumn('uuid')
  id?: string;

  @Column({ name: 'quiz_id', type: 'uuid' })
  quiz_id: string;

  @Column({ type: 'enum', enum: TipoQuestaoEnum })
  tipo: TipoQuestaoEnum;

  @Column({ type: 'text' })
  enunciado: string;

  @Column({ type: 'int' })
  ordem: number;

  @Column({ name: 'pontuacao_peso', type: 'numeric', precision: 5, scale: 2, default: 1.0 })
  pontuacao_peso: number;

  @Column({ type: 'jsonb', default: {} })
  configuracao: Record<string, any>;

  @ManyToOne(() => QuizEntity, (quiz) => quiz.questoes, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'quiz_id' })
  quiz: QuizEntity;

  @OneToMany(() => OpcaoEntity, (opcao) => opcao.questao, { cascade: true })
  opcoes?: OpcaoEntity[] | [];

  toDto(): QuestaoDto {
    return QuestaoDto.fromClass({
      id: this.id,
      quiz_id: this.quiz_id,
      tipo: this.tipo,
      enunciado: this.enunciado,
      ordem: this.ordem,
      pontuacao_peso: Number(this.pontuacao_peso), // numeric retorna como string no pg
      configuracao: this.configuracao,
      opcoes: this.opcoes ? this.opcoes.map((o) => o.toDto()) : undefined,
    });
  }
}