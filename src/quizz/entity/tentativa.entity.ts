import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { QuizEntity } from './quizz.entity';
import { TentativaDto } from '../dto/tentativa.dto';
import { StatusTentativaEnum } from '../../enums/status-tentativa.enum';
import { Aluno } from '../../alunos/entity/aluno.entity';

@Entity('tentativas')
export class TentativaEntity {
  @PrimaryGeneratedColumn('uuid')
  id?: string;

  @Column({ name: 'quiz_id', type: 'uuid' })
  quiz_id: string;

  @Column({ name: 'aluno_id', type: 'uuid' })
  aluno_id: string;

  @Column({ type: 'varchar', length: 50, default: StatusTentativaEnum.EM_ANDAMENTO })
  status: StatusTentativaEnum;

  @Column({ name: 'nota_final', type: 'numeric', precision: 5, scale: 2, nullable: true })
  nota_final: number;

  @CreateDateColumn({ name: 'iniciada_em', type: 'timestamptz' })
  iniciada_em: Date;

  @Column({ name: 'concluida_em', type: 'timestamptz', nullable: true })
  concluida_em: Date | null;

  @Column({ type: 'jsonb', default: {} })
  respostas: Record<string, any>;

  @ManyToOne(() => QuizEntity, (quiz) => quiz.tentativas, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'quiz_id' })
  quiz?: QuizEntity;

  @ManyToOne(() => Aluno, (aluno) => aluno.tentativas, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'aluno_id' })
  aluno?: Aluno;

  toDto(): TentativaDto {
    return TentativaDto.fromClass({
      id: this.id,
      quiz_id: this.quiz_id,
      aluno_id: this.aluno_id,
      status: this.status,
      nota_final: this.nota_final ? Number(this.nota_final) : undefined,
      iniciada_em: this.iniciada_em,
      concluida_em: this.concluida_em ?? undefined,
      respostas: this.respostas,
    });
  }
}