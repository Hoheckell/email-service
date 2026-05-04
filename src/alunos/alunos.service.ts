/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Injectable } from '@nestjs/common';
import { createClient } from '@supabase/supabase-js';
import { AlunoDto } from './dto/aluno.dto';
import { MailService } from '../mail/mail.service';
import { getSupabaseClient } from '../supabase/supabase.client';
import { AlunoInterface } from './interface/aluno.interface';

@Injectable()
export class AlunosService {
  constructor(private readonly mailService: MailService) {}

  private supabaseAdmin = createClient(
    process.env.SUPABASE_URL as string,
    process.env.SUPABASE_SECRET_KEY as string,
  );

  async update(aluno: AlunoDto, authId: string) {
    const supabase = getSupabaseClient();
    let emailChanged = false;
    if (aluno.oldEmail !== aluno.email) {
      emailChanged = true;
      const { data: authData, error: authError } =
        await this.supabaseAdmin.auth.admin.updateUserById(
          authId,
          { email: aluno.email, email_confirm: true }, // Confirma automaticamente
        );

      if (authError) throw authError;
    }
    const { error: perfilError } = await supabase
      .from('alunos')
      .update({
        nome: aluno.nome,
        email: aluno.email,
        whatsapp: aluno.whatsapp,
        codigo: aluno.codigo,
        ativo: aluno.ativo,
        avatar: aluno.avatar,
      })
      .eq('auth_id', authId);

    if (perfilError) throw perfilError;
    const { data: student } = await supabase
      .from('alunos')
      .select('*')
      .eq('auth_id', authId)
      .single();
    if (student) {
      if (emailChanged) {
        const mail = {
          to: student.email,
          subject: '[ClassConnect] - Alteração de email, confirme',
          template: 'email-confirm',
          context: {
            name: student.nome,
            code: aluno.codigo,
          },
        };
        await this.mailService.sendMail(mail);
      }
      return AlunoDto.fromJson({
        authId: authId,
        nome: student.nome as string,
        email: student.email as string,
        whatsapp: student.whatsapp as string,
        codigo: student.codigo as string,
        ativo: student.ativo as boolean,
        avatar: student.avatar as string,
      });
    }
  }

  async joinTurma(authId: string, codigo: any) {
    try {
      const { data: turma, error: turmaError } = await this.supabaseAdmin
        .from('turmas')
        .select('*')
        .eq('codigo', codigo)
        .single();
      if (turmaError) throw turmaError;
      const { error: joinError } = await this.supabaseAdmin
        .from('turmas_alunos')
        .insert({
          aluno_id: authId,
          turma_id: turma.id,
        });
      if (joinError) throw joinError;
      return { success: true };
    } catch (error) {
      return { success: false };
    }
  }
  
  async show(id: string): Promise<AlunoDto | null> {
    const supabase = getSupabaseClient();
    const { data: aluno } = await supabase
      .from('alunos')
      .select('*')
      .eq('auth_id', id)
      .single();
    if (aluno) {
      return AlunoDto.fromJson({
        authId: aluno.auth_id,
        nome: aluno.nome as string,
        email: aluno.email as string,
        whatsapp: aluno.whatsapp as string,
        codigo: aluno.codigo as string,
        ativo: aluno.ativo as boolean,
        avatar: aluno.avatar as string,
      });
    }
    return null;
  }

  async findAll(): Promise<AlunoDto[]> {
    const supabase = getSupabaseClient();
    const { data: alunos } = await supabase
      .from('alunos')
      .select('*');
    if (alunos) {
      return alunos.map((aluno: AlunoInterface) => AlunoDto.fromJson(aluno));
    }
    return [];
  }

  async remove(id: string): Promise<boolean> {
    const supabase = getSupabaseClient();
    const { error } = await supabase
      .from('alunos')
      .delete()
      .eq('auth_id', id);
    if (error) throw error;
    return true;
  }

  async uploadFile(file: Express.Multer.File) {
      const supabase = getSupabaseClient();
      const fileName = `avatar/${Date.now()}-${file.originalname}`;
      const { data, error } = await supabase.storage
        .from('user')
        .upload(fileName, file.buffer, {
            contentType: file.mimetype
        });

        if (error) {
        throw new Error(error.message);
        }

        const { data: publicUrl } = supabase.storage
        .from('user')
        .getPublicUrl(fileName);

        return {
        path: data.path,
        url: publicUrl.publicUrl
        };
  }
}
