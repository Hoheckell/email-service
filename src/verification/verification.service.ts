import { Injectable, BadRequestException } from '@nestjs/common';
import { getSupabaseClient } from '../supabase/supabase.client';
import { UserRoleEnum } from '../auth/enum/enums';

@Injectable()
export class VerificationService {
  async verifyCode(email: string, codigo: string, role: UserRoleEnum, authToken: string) {
    const supabase = getSupabaseClient(authToken);
    if (role == UserRoleEnum.ALUNO) {
      const { data, error } = await supabase
        .from('alunos')
        .select('*')
        .eq('email', email)
        .eq('codigo', codigo)
        .maybeSingle();
      if (error || !data) {
        throw new BadRequestException('Código inválido ou expirado');
      }
      await supabase.from('alunos').update({ codigo: null }).eq('auth_id', data.auth_id);
    } else if (role == UserRoleEnum.PROFESSOR) {
      const { data, error } = await supabase
        .from('professores')
        .select('*')
        .eq('email', email)
        .eq('codigo', codigo)
        .maybeSingle();

      if (error || !data) {
        throw new BadRequestException('Código inválido ou expirado');
      }
      await supabase
        .from('professores')
        .update({ codigo: null })
        .eq('id', data.id);
    } else {
      throw new BadRequestException('Role inválido');
    }

    return { valid: true };
  }
}
