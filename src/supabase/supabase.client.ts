import { createClient } from '@supabase/supabase-js';
import 'dotenv/config';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Supabase environment variables are missing');
}

// Em vez de exportar a constante, exportamos uma FUNÇÃO
export const getSupabaseClient = (userToken?: string) => {
  // Se o token for passado, adiciona no header. Se não, cria um client anônimo padrão.
  const options = userToken 
    ? { 
        global: { 
            headers: { 
                Authorization: `Bearer ${userToken}` 
            } 
        } 
      } 
    : {};

  return createClient(supabaseUrl, supabaseKey, options);
};