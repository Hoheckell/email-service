import { AlunoInterface } from "../../alunos/interface/aluno.interface";
import { TurmaInterface } from "./turma.interface";

export interface TurmaAlunoInterface {
    id: number;
    turmaId: number;
    alunoId: string;
    alunos: AlunoInterface[] | [];
    turmas: TurmaInterface[] | [];
}