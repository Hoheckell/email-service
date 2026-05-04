
export interface AvisoInterface {
    id?: string | null;
    turma_id: string;
    titulo: string;
    conteudo: string;
    criado_em?: Date | null;
    is_urgente: boolean;
}