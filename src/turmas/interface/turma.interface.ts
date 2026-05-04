import { ProfessorInterface } from '../../professores/interface/professor.interface';

export interface TurmaInterface {
  id: number;
  professorId: string;
  codigo: string;
  disciplina: string;
  descricao?: string;
  dataInicio: Date;
  dataFim: Date;
  criadoEm: Date;
  icone: number;
  professor?: ProfessorInterface | null;
  eventos_turma?: any[] | null;
  materiais?: any[] | null;
  turmas_alunos?: any[] | null;
  quizzes?: any[] | null;
}
