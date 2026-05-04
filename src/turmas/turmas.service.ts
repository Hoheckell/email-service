/* eslint-disable @typescript-eslint/no-unsafe-assignment */

import { Injectable } from '@nestjs/common';
import { getSupabaseClient } from '../supabase/supabase.client';
import { UserRoleEnum } from '../auth/enum/enums';
import { TurmaDto } from './dto/turma.dto';
import { TurmaInterface } from './interface/turma.interface';
import { EventoDto } from '../eventos/dto/evento.dto';
import { MaterialDto } from '../materiais/dto/material.dto';
import { AlunoDto } from '../alunos/dto/aluno.dto';
import { QuizDto } from '../quizz/dto/quizz.dto';
import { TurmaAlunoDto } from './dto/turma-aluno.dto';

@Injectable()
export class TurmasService {
  async getTurmaByCodigo(codigo: string, authToken: string): Promise<TurmaDto> {
    const supabase = getSupabaseClient(authToken);
    const { data: turma, error } = await supabase
      .from('turmas')
      .select('*')
      .eq('codigo', codigo)
      .single();
    if (error) throw error;
    return TurmaDto.fromSupabase(turma);
  }

  async createTurma(dto: TurmaDto, professorAuthId: string, authToken: string) {
    const supabase = getSupabaseClient(authToken);

    const { data: turma, error } = await supabase.from('turmas').insert({
      disciplina: dto.disciplina,
      codigo: dto.codigo,
      data_inicio: dto.dataInicio,
      data_fim: dto.dataFim,
      professor_id: professorAuthId,
      icone: dto.icone,
      descricao: dto.descricao,
    });
    if (error) throw error;
    return turma;
  }

  async updateTurma(dto: TurmaDto, turmaId: number, authToken: string) {
    const supabase = getSupabaseClient(authToken);
    const { data: turma, error } = await supabase
      .from('turmas')
      .update({
        disciplina: dto.disciplina,
        codigo: dto.codigo,
        data_inicio: dto.dataInicio,
        data_fim: dto.dataFim,
        professor_id: dto.professorId,
        icone: dto.icone,
        descricao: dto.descricao,
      })
      .eq('id', turmaId);
    if (error) throw error;
    return TurmaDto.fromSupabase(turma as any);
  }

  async deleteTurma(turmaId: number, authToken: string) {
    const supabase = getSupabaseClient(authToken);
    const { error: errorTurmas } = await supabase
      .from('turmas')
      .delete()
      .eq('id', turmaId);
    if (errorTurmas) throw errorTurmas;
    const { error: errorTurmasAlunos } = await supabase
      .from('turmas_alunos')
      .delete()
      .eq('turma_id', turmaId);
    if (errorTurmasAlunos) throw errorTurmasAlunos;
    return { success: true };
  }

  async getTurmas(
    authId: string,
    role: UserRoleEnum,
    authToken: string,
  ): Promise<TurmaDto[]> {
    const supabase = getSupabaseClient(authToken);
    if (role === UserRoleEnum.PROFESSOR) {
      const { data: turmas, error } = await supabase
        .from('turmas')
        .select(
          `
                    *,
                    materiais (*),
                    eventos_turma (*),
                    professores (*),
                    turmas_alunos (*)
                `,
        )
        .eq('professor_id', authId);
      if (error) throw error;
      const turmasArray: TurmaDto[] = [];
      if (turmas != null && !Array.isArray(turmas)) {
        turmasArray.push(TurmaDto.fromSupabase(turmas));
      }
      if (Array.isArray(turmas) && turmas.length > 0) {
        for (const turma of turmas) {
          turmasArray.push(TurmaDto.fromSupabase(turma));
        }
      }
      return turmasArray;
    }
    const { data: turmasAluno, error } = await supabase
      .from('turmas_alunos')
      .select(
        `
                turmas (*)
            `,
      )
      .eq('aluno_id', authId);
    if (error) throw error;
    type TurmasAlunoRecord = { turmas?: unknown };
    const turmasAlunoData = turmasAluno as
      | TurmasAlunoRecord
      | TurmasAlunoRecord[];
    const turmasArray: TurmaDto[] = [];
    if (
      turmasAlunoData != null &&
      !Array.isArray(turmasAlunoData) &&
      turmasAlunoData.turmas != null
    ) {
      turmasArray.push(
        TurmaDto.fromSupabase(turmasAlunoData.turmas as TurmaInterface),
      );
    }
    if (Array.isArray(turmasAlunoData) && turmasAlunoData.length > 0) {
      for (const item of turmasAlunoData) {
        if (item.turmas != null) {
          const turmadto = TurmaDto.fromSupabase(item.turmas as TurmaInterface);
          const { data: turmajson, error } = await supabase
            .from('turmas')
            .select(
              `
                    *,
                    materiais (*),
                    eventos_turma (*),
                    professores (*),
                    avisos (*)
                `,
            )
            .eq('id', turmadto.id);
          if (error) throw error;
          if (turmajson != null) {
            for (const turma of turmajson) {
              turmasArray.push(TurmaDto.fromSupabase(turma as TurmaInterface));
            }
          }
        }
      }
    }
    return turmasArray;
  }

  async getMateriais(
    turmaId: number,
    authToken: string,
  ): Promise<MaterialDto[]> {
    const supabase = getSupabaseClient(authToken);
    const { data: materiais, error } = await supabase
      .from('materiais')
      .select('*')
      .eq('turma_id', turmaId);
    if (error) throw error;
    return materiais.map((material: MaterialDto) =>
      MaterialDto.fromSupabase(material),
    );
  }

  async getEventos(turmaId: number, authToken: string): Promise<EventoDto[]> {
    const supabase = getSupabaseClient(authToken);
    const { data: eventos, error } = await supabase
      .from('eventos_turma')
      .select('*')
      .eq('turma_id', turmaId);
    if (error) throw error;
    return eventos.map((evento: EventoDto) => EventoDto.fromSupabase(evento));
  }

  async getAlunos(turmaId: number, authToken: string): Promise<AlunoDto[]> {
    const supabase = getSupabaseClient(authToken);
    const { data, error } = await supabase
      .from('turmas_alunos')
      .select(
        `
            alunos (*)
        `,
      )
      .eq('turma_id', turmaId)
      .maybeSingle();
    if (error) throw error;
    if (data != null && !Array.isArray(data.alunos)) {
      return [AlunoDto.fromSupabase(data.alunos)];
    }
    if (Array.isArray(data) && data.length > 0) {
      const turmasAlunos = data.map((item) => TurmaAlunoDto.fromSupabase(item));
      return turmasAlunos.flatMap((item) => item.alunos);
    }
    return [];
  }

  async getQuizzes(id: number, authToken: string): Promise<QuizDto[]> {
    const supabase = getSupabaseClient(authToken);
    const { data: quizzes, error } = await supabase
      .from('quizzes')
      .select('*')
      .eq('turma_id', id);
    if (error) throw error;
    return quizzes.map((quizz: QuizDto) => QuizDto.fromSupabase(quizz));
  }
}
