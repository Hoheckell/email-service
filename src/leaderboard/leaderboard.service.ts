import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { getSupabaseClient } from '../supabase/supabase.client';

@Injectable()
export class LeaderboardService {
    async getLeaderboard() {
        const supabase = getSupabaseClient();
        const { data, error } = await supabase
            .from('leaderboard')
            .select('username, score')
            .order('score', { ascending: false })
            .limit(10);
            
        return data; 
    }
    
    async addPoints(username: string, points: number) {
        const supabase = getSupabaseClient();

        const { data, error } = await supabase.rpc('add_points', { points_to_add: points, username });
        if (error) {console.error('Erro Supabase:', error);
            throw new InternalServerErrorException(error.message);
        }
        
        return {
            username: username,
            new_score: data // Ou data[0].score se vier em array
        };
    }

    async getRival(currentScore: number) {
        const supabase = getSupabaseClient();
        const { data, error } = await supabase
            .from('leaderboard')
            .select('username, score')
            .gt('score', currentScore) // Score Maior que o atual
            .order('score', { ascending: true }) // O menor dos maiores (o mais próximo)
            .limit(1)
            .single();
            
        return data; 
    }

    async getScore(username: string) {
        const supabase = getSupabaseClient();
        const { data, error } = await supabase
            .from('leaderboard')
            .select('score')
            .eq('username', username)
            .single();
            
        return data; 
    }
}
