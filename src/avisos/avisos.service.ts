import { Injectable } from '@nestjs/common';
import { AvisoDto } from './dto/aviso.dto';
import { getSupabaseClient } from '../supabase/supabase.client';

@Injectable()
export class AvisosService {

    async remove(id: string, authHeader: string): Promise<boolean | PromiseLike<boolean>> {
        const supabase = getSupabaseClient(authHeader);
        const { error } = await supabase.from('avisos').delete().eq('id', id);
        if (error) {
            throw error;
        }
        return true;
    }
    
    async findAllByTurma(turmaId: string, authHeader: string): Promise<AvisoDto[] | PromiseLike<AvisoDto[]>> {
        const supabase = getSupabaseClient(authHeader);
        const { data, error } = await supabase.from('avisos').select('*').eq('turma_id', turmaId);
        if (error) {
            throw error;
        }
        if (!data) {
            return [];
        }
        return data.map((aviso) => AvisoDto.fromClass(aviso));
    }
    
    async update(aviso: AvisoDto, id: string, authHeader: string): Promise<AvisoDto | PromiseLike<AvisoDto>> {
        const supabase = getSupabaseClient(authHeader);
        const { data, error } = await supabase.from('avisos').update(aviso).eq('id', id).select();
        if (error) {
            throw error;
        }
        if (!data) {
            throw new Error('Aviso não encontrado');
        }
        return AvisoDto.fromClass(data[0]);
    }
    
    async show(id: string, authHeader: string): Promise<AvisoDto | PromiseLike<AvisoDto | null> | null> {
        const supabase = getSupabaseClient(authHeader);
        const { data, error } = await supabase.from('avisos').select('*').eq('id', id).single();
        if (error) {
            throw error;
        }
        if (!data) {
            throw new Error('Aviso não encontrado');
        }
        return AvisoDto.fromClass(data);
    }
    
    async findAll(authHeader: string): Promise<AvisoDto[] | PromiseLike<AvisoDto[]>> {
        const supabase = getSupabaseClient(authHeader);
        const { data, error } = await supabase.from('avisos').select('*');
        if (error) {
            throw error;
        }
        if (!data) {
            return [];
        }
        return data.map((aviso) => AvisoDto.fromClass(aviso));
    }
    
    async create(aviso: AvisoDto, authHeader: string): Promise<AvisoDto | PromiseLike<AvisoDto>> {
        const supabase = getSupabaseClient(authHeader);
        const { data, error } = await supabase.from('avisos')
            .insert(aviso)
            .select('*')
            .single();
        if (error) {
            throw error;
        }
        if (!data) {
            throw new Error('Aviso não encontrado');
        }
        return AvisoDto.fromClass(data);
    }
}
