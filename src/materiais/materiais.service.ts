import { Injectable } from '@nestjs/common';
import { NotificationsGateway } from '../notifications/notifications.gateway';
import { getSupabaseClient } from '../supabase/supabase.client'; 
import { MaterialDto } from './dto/material.dto';
import { AlunoDto } from '../alunos/dto/aluno.dto';
import { UserRoleEnum } from '../auth/enum/enums';
import { MaterialInterface } from './interface/material.interface';

@Injectable()
export class MateriaisService {
    constructor(
    // Injeção de Dependência normal do NestJS
    private notificationsGateway: NotificationsGateway
  ) {}


  async uploadFile(file: Express.Multer.File) {
      const supabase = getSupabaseClient();
      const fileName = `material/${Date.now()}-${file.originalname}`;
      const { data, error } = await supabase.storage
        .from('users')
        .upload(fileName, file.buffer, {
            contentType: file.mimetype
        });

        if (error) {
        throw new Error(error.message);
        }

        const { data: publicUrl } = supabase.storage
        .from('users')
        .getPublicUrl(fileName);

        return {
        path: data.path,
        url: publicUrl.publicUrl
        };
  }

  async createMaterial(data: MaterialInterface, file: Express.Multer.File | null, authToken: string, role: UserRoleEnum) {
    if (role == UserRoleEnum.PROFESSOR) {      
        const supabase = getSupabaseClient();
        let url = '';
        if (file) {
          url = (await this.uploadFile(file)).url;
        }
        const { data: novoMaterial, error } = await supabase.from('materiais').insert({nome: data.nome, turma_id: Number(data.turmaId), link: url}).select();

        if (error) {
          throw error;
        }
        const { data: alunos, error: alunosError } = await supabase.from('turmas_alunos').select('aluno_id').eq('turma_id', data.turmaId);

        if (alunosError) {
          throw alunosError;
        }

        // 2. Busca IDs dos alunos da turma...
        const alunosIds = alunos.map((aluno) => aluno.aluno_id);

        // 3. Dispara o Socket (Loop ou Sala de Turma)
        alunosIds.forEach(id => {
          this.notificationsGateway.sendToUser(id.toString(), {
            title: 'Novo Material',
            content: `O arquivo ${novoMaterial[0].nome} foi adicionado.`,
            metadata: { materialId: novoMaterial[0].id }
          });
        });
    }
    else {
      throw new Error('Usuário não autorizado');
    }
  }
  
  async getMateriais(turmaId: number, authToken: string) {
    const supabase = getSupabaseClient(authToken);
    const { data: materiais, error } = await supabase.from('materiais').select('*').eq('turma_id', turmaId);
    
    if (error) {
      throw error;
    }
    
    return materiais;
  }
}
