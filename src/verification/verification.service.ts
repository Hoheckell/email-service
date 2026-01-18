import { Injectable, BadRequestException } from '@nestjs/common';
import { supabase } from '../supabase/supabase.client';

@Injectable()
export class VerificationService {
  async verifyCode(email: string, codigo: string, tipo: number) {
    if (tipo == 1) {
      const { data, error } = await supabase
        .from('alunos')
        .select('*')
        .eq('email', email)
        .eq('codigo', codigo)
        .maybeSingle();

      if (error || !data) {
        throw new BadRequestException('Código inválido ou expirado');
      }
      await supabase.from('alunos').update({ codigo: null }).eq('id', data.id);
    } else {
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
    }

    return { valid: true };
  }
}
