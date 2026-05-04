export interface NotificationInterface {
    id: number;
    titulo: string;
    conteudo: string;
    recipient_id: string;
    recipient_role: string;
    is_read: boolean;
    created_at: Date;
    updated_at: Date;
}
