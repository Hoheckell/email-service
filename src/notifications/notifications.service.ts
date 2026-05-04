import { Injectable } from '@nestjs/common';
import { NotificationsGateway } from './notifications.gateway';
import { SendNotificationDto } from './dto/send-notification.dto';
import { NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { getSupabaseClient } from '../supabase/supabase.client'; 
import { NotificationDto } from './dto/notification.dto';
import { ProfessoresService } from '../professores/professores.service';
import { AlunosService } from '../alunos/alunos.service';
import { ProfessorDto } from '../professores/dto/professor.dto';
import { AlunoDto } from '../alunos/dto/aluno.dto';

@Injectable()
export class NotificationsService {
  constructor( // Injetado via provider
    private notificationsGateway: NotificationsGateway,
    private professoresService: ProfessoresService,
    private alunosService: AlunosService
  ) {}

  async checkUserType(recipient_role: string, recipient_id: string) : Promise<ProfessorDto | AlunoDto> {

    let professor: ProfessorDto | null = null;
    let aluno: AlunoDto | null = null;
    if (recipient_role === 'PROFESSOR') {
      professor = await this.professoresService.show(recipient_id);
      if (!professor) {
        throw new NotFoundException('Professor não encontrado');
      }
      return professor;
    } else if (recipient_role === 'ALUNO') {
      aluno = await this.alunosService.show(recipient_id);
      if (!aluno) {
        throw new NotFoundException('Aluno não encontrado');
      }
      return aluno;
    }
    throw new NotFoundException('Tipo de usuário não encontrado.');
  }

  async sendToClass(professorId: string, dto: SendNotificationDto) {
    // 1. Validar se a turma realmente pertence a esse professor
    // (Pule essa etapa se confiar cegamente, mas é bom validar)

    // 2. Buscar TODOS os alunos matriculados nessa turma
    // SELECT aluno_id FROM turmas_alunos WHERE turma_id = X
    const supabase = getSupabaseClient();
    const { data: matriculas, error } = await supabase
      .from('turmas_alunos')
      .select('aluno_id') // Assumindo que alteramos 'aluno_id' para UUID na migração anterior
      .eq('turma_id', dto.turmaId);

    if (error || ((matriculas?.length ?? 0) > 0)) {
      throw new NotFoundException('Turma vazia ou não encontrada.');
    }

    // 3. Preparar o array de notificações para inserção em lote (Bulk Insert)
    const notificationsToInsert = matriculas.map((m) => ({
      recipient_id: m.aluno_id, // UUID
      sender_id: professorId, // UUID do Professor
      recipient_role: 'ALUNO',
      type: 'MANUAL',
      title: dto.titulo,
      content: dto.conteudo,
      metadata: { turma_id: dto.turmaId }
    }));

    // 4. Salvar no Supabase
    const { data: insertedData, error: insertError } = await supabase
      .from('notifications')
      .insert(notificationsToInsert)
      .select(); // Retorna os dados criados para podermos enviar no socket

    if (insertError) throw new InternalServerErrorException('Erro ao salvar notificações');

    // 5. Disparar Socket para cada aluno (Realtime)
    // O Gateway já tem a lógica de enviar para a sala `user_{id}`
    insertedData.forEach((notif) => {
      this.notificationsGateway.sendToUser(notif.recipient_id, notif);
    });

    return { success: true, count: insertedData.length };
  }

  async getNotifications(recipient_id: string, recipient_role: string) {
    // Verificar se é professor ou aluno
    const supabase = getSupabaseClient();
    const user = await this.checkUserType(recipient_role, recipient_id);
    
    const { data, error } = await supabase.from('notifications').select('*').eq('recipient_id', user.authId).eq('recipient_role', recipient_role);
    if (error) throw new InternalServerErrorException('Erro ao buscar notificações');
    const notifications = data.map((notification) => NotificationDto.fromJson(notification));
    return notifications;
  }
  
  async getUnreadCount(recipient_id: string, recipient_role: string) {
    const supabase = getSupabaseClient();
    const user = await this.checkUserType(recipient_role, recipient_id);
    
    const { data, error } = await supabase.from('notifications').select('*').eq('is_read', false).eq('recipient_id', user.authId).eq('recipient_role', recipient_role);
    if (error) {
      console.error(error);
      throw new InternalServerErrorException(`Erro ao buscar notificações não lidas`);
    }
    return data.length;
  }
  
  async markAsRead(notificationId: string, recipient_id: string, recipient_role: string) {
    const supabase = getSupabaseClient();
    const user = await this.checkUserType(recipient_role, recipient_id);
    
    const { data, error } = await supabase.from('notifications').update({ is_read: true }).eq('id', notificationId).eq('recipient_id', user.authId).eq('recipient_role', recipient_role);
    if (error) throw new InternalServerErrorException(`Erro ao marcar notificação como lida`);
    return data;
  }
  
  async deleteNotification(notificationId: string) {
    const supabase = getSupabaseClient();
    const { data, error } = await supabase.from('notifications').delete().eq('id', notificationId);
    if (error) throw new InternalServerErrorException(`Erro ao deletar notificação`);
    return data;
  }

  async markAllAsRead(recipient_id: string, recipient_role: string) {
    const supabase = getSupabaseClient();
    const user = await this.checkUserType(recipient_role, recipient_id);
    
    const { data, error } = await supabase.from('notifications').update({ is_read: true }).eq('recipient_id', user.authId).eq('recipient_role', recipient_role);
    if (error) throw new InternalServerErrorException(`Erro ao marcar notificações como lidas`);
    return data;
  }
}
