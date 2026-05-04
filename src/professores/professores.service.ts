/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Injectable } from '@nestjs/common';
import { ProfessorDto } from './dto/professor.dto';
import { createClient } from '@supabase/supabase-js';
import { MailService } from '../mail/mail.service';
import { getSupabaseClient } from '../supabase/supabase.client';

@Injectable()
export class ProfessoresService {
  constructor(private readonly mailService: MailService) {}
  private supabaseAdmin = createClient(
    process.env.SUPABASE_URL as string,
    process.env.SUPABASE_SECRET_KEY as string,
  );

  async update(professor: ProfessorDto, authId: string) {
    let emailChanged = false;
    const supabase = getSupabaseClient();
    if (professor.oldEmail !== professor.email) {
      emailChanged = true;
      const { data: authData, error: authError } =
        await this.supabaseAdmin.auth.admin.updateUserById(
          authId,
          { email: professor.email, email_confirm: true }, // Confirma automaticamente
        );

      if (authError) throw authError;
    }
    const { error: perfilError } = await supabase
      .from('professores')
      .update({
        nome: professor.nome,
        email: professor.email,
        whatsapp: professor.whatsapp,
        codigo: professor.codigo,
        ativo: professor.ativo,
        avatar: professor.avatar,
      })
      .eq('auth_id', authId);

    if (perfilError) throw perfilError;
    const { data: prof } = await supabase
      .from('professores')
      .select('*')
      .eq('auth_id', authId)
      .single();
    if (prof) {
      if (emailChanged) {
        const mail = {
          to: prof.email,
          subject: '[ClassConnect] - Alteração de email, confirme',
          template: 'email-confirm',
          context: {
            name: prof.nome,
            code: prof.codigo,
          },
        };
        await this.mailService.sendMail(mail);
      }
      return ProfessorDto.fromJson({
        authId: authId,
        nome: prof.nome as string,
        email: prof.email as string,
        whatsapp: prof.whatsapp as string,
        codigo: prof.codigo as string,
        ativo: prof.ativo as boolean,
        avatar: prof.avatar as string,
      });
    }
  }

  async show(id: string): Promise<ProfessorDto | null> {
    const supabase = getSupabaseClient();
    const { data: prof } = await supabase
      .from('professores')
      .select('*')
      .eq('auth_id', id)
      .single();
    if (prof) {
      return ProfessorDto.fromJson({
        authId: prof.auth_id,
        nome: prof.nome as string,
        email: prof.email as string,
        whatsapp: prof.whatsapp as string,
        codigo: prof.codigo as string,
        ativo: prof.ativo as boolean,
        avatar: prof.avatar as string,
      });
    }
    return null;
  }
}
