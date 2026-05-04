import { Injectable } from '@nestjs/common';
import { getSupabaseClient } from '../supabase/supabase.client';
import { EventoDto } from './dto/evento.dto';
import { EventoInterface } from './interface/evento.interface';

@Injectable()
export class EventosService {

    async getEventos(turmaId: number): Promise<EventoDto[]> {
        const supabase = getSupabaseClient();
        const { data, error } = await supabase.from('eventos_turma').select('*').eq('turma_id', turmaId).gte('data_evento', new Date().toISOString());
        if (error) {
            console.error(error);
            return [];
        }
        if (!data) {
            return [];
        }
        const eventos: EventoDto[] = [];
        for (const evento of data) {
            eventos.push(EventoDto.fromJson(evento as EventoInterface));
        }
        return eventos;
    }

    async getTodosEventos(turmaId: number): Promise<EventoDto[]> {
        const supabase = getSupabaseClient();
        const { data, error } = await supabase.from('eventos_turma').select('*').eq('turma_id', turmaId);
        if (error) {
            console.error(error);
            return [];
        }
        if (!data) {
            return [];
        }
        const eventos: EventoDto[] = [];
        for (const evento of data) {
            eventos.push(EventoDto.fromJson(evento as EventoInterface));
        }
        return eventos;
    }

}
