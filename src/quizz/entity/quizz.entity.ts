import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany, JoinColumn, ManyToOne, JoinTable } from 'typeorm';
import { QuestaoEntity } from './questao.entity';
import { QuizDto } from '../dto/quizz.dto';
import { Turma } from '../../turmas/entity/turma.entity';
import { StatusEnum } from '../../auth/enum/enums';
import { TurmaDto } from '../../turmas/dto/turma.dto';
import { IsEnum, IsNotEmpty, IsOptional } from 'class-validator';
import { TentativaEntity } from './tentativa.entity';

@Entity('quizzes')
export class QuizEntity {
  @PrimaryGeneratedColumn('uuid')
  id?: string;

  @IsNotEmpty({ message: 'Turma é obrigatória' })
  @Column({ name: 'turma_id', type: 'uuid' })
  turma_id: string;

  @IsNotEmpty({ message: 'Título é obrigatório' })
  @Column({ type: 'varchar', length: 255 })
  titulo: string;

  @IsOptional()
  @Column({ name: 'data_conclusao', type: 'timestamptz', nullable: true })
  data_conclusao: Date | null;

  @CreateDateColumn({ name: 'criado_em', type: 'timestamptz' })
  criado_em: Date;

  @IsOptional()
  @UpdateDateColumn({ name: 'atualizado_em', type: 'timestamptz' })
  atualizado_em: Date;

  @IsEnum(StatusEnum, { message: 'Status inválido' })
  @Column({ name: 'status', type: 'enum', enum: StatusEnum })
  status: StatusEnum;

  @IsOptional()
  @OneToMany(() => QuestaoEntity, (questao) => questao.quiz, { cascade: true })
  questoes?: QuestaoEntity[] | [];

  @IsOptional()
  @ManyToOne(() => Turma, (turma) => turma.quizzes, { onDelete: 'CASCADE' })
  @JoinTable({ name: 'turmas', joinColumn: { name: 'id' }, inverseJoinColumn: { name: 'turma_id' } })
  turma?: Turma;

  @IsOptional()
  @Column({ name: 'total_tentativas', type: 'int', nullable: true })
  totalTentativas?: number;

  @IsOptional()
  @OneToMany(() => TentativaEntity, (tentativa) => tentativa.quiz, { cascade: true })
  tentativas?: TentativaEntity[] | [];

  toDto(): QuizDto {
    return QuizDto.fromClass({
      id: this.id,
      turma_id: this.turma_id,
      titulo: this.titulo,
      data_conclusao: this.data_conclusao ?? undefined,
      criado_em: this.criado_em,
      atualizado_em: this.atualizado_em,
      questoes: this.questoes ? this.questoes.map((q) => q.toDto()) : undefined,
      status: this.status,
      turma: this.turma ? TurmaDto.fromClass(this.turma) : undefined,
    });
  }
}