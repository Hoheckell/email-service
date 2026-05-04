import { TurmaInterface } from "../../turmas/interface/turma.interface";

export interface EventoInterface {
    id?: number | null;
    dataEvento?: Date | null;
    descricao?: string | null;
    turmaId?: number | null;
    turma?: TurmaInterface | null;
}