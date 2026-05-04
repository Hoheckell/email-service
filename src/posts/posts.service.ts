import { Injectable } from '@nestjs/common';
import { PostDto } from './dto/post.dto';
import { getSupabaseClient } from '../supabase/supabase.client';
import { IPost } from './interface/post.interface';

@Injectable()
export class PostsService {

    async create(post: PostDto): Promise<PostDto> {
        const supabase = getSupabaseClient();
        const entity = post.toEntity(); 
        const { data, error } = await supabase
            .from('posts')
            .insert(entity)
            .select()
            .single();
        if (error) throw error;
        return PostDto.fromJson(data);
    }

    async findAll(): Promise<PostDto[]> {
        const supabase = getSupabaseClient();
        const { data, error } = await supabase
            .from('posts')
            .select('*');
        if (error) throw error;
        return data.map((post: IPost) => PostDto.fromJson(post));
    }

    async findOne(id: string): Promise<PostDto> {
        const supabase = getSupabaseClient();
        const { data, error } = await supabase
            .from('posts')
            .select('*')
            .eq('id', id)
            .single();
        if (error) throw error;
        return PostDto.fromJson(data);
    }

    async update(id: string, post: PostDto): Promise<PostDto> {
        const supabase = getSupabaseClient();
        const entity = post.toEntity();
        const { data, error } = await supabase
            .from('posts')
            .update(entity)
            .eq('id', id)
            .select()
            .single();
        if (error) throw error;
        return PostDto.fromJson(data);
    }

    async remove(id: string): Promise<boolean> {
        const supabase = getSupabaseClient();
        const { error } = await supabase
            .from('posts')
            .delete()
            .eq('id', id);
        if (error) throw error;
        return true;
    }

    async uploadFile(file: Express.Multer.File) {
        const supabase = getSupabaseClient();
        const fileName = `posts/${Date.now()}-${file.originalname}`;
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
}
