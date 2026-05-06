import { HttpException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { PostDto } from './dto/post.dto';
import { getSupabaseClient } from '../supabase/supabase.client';
import { IPost } from './interface/post.interface';
import { IImage } from '../images/interfaces/images.interface';

@Injectable()
export class PostsService {

    async create(post: PostDto): Promise<PostDto> {
        const supabase = getSupabaseClient();
        const { data, error } = await supabase
            .from('posts')
            .insert(post)
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
        const { data, error } = await supabase
            .from('posts')
            .update({ ...post, id: undefined, created_at: undefined })
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

    async uploadFile(file: Express.Multer.File): Promise<IImage> {
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

        const { data: fileSearch, error: searchError } = await supabase.storage
            .from('users')
            .list('posts', { limit: 1, offset: 0, search: fileName });

        if (searchError) {
            throw new HttpException('Erro ao buscar arquivo', 500);
        }

        const fileSearchData: IImage = {
            id: fileSearch[0].id,
            name: fileSearch[0].name,
            created_at: fileSearch[0].created_at,
            metadata: fileSearch[0].metadata,
            url: fileSearch[0].metadata?.publicUrl
        };

        if (!fileSearchData || !fileSearchData.url) {
            throw new HttpException('Arquivo não encontrado', 404);
        }
        return fileSearchData
  }

  async getPostBySlug(slug: string): Promise<PostDto> {
    const supabase = getSupabaseClient();
    const { data, error } = await supabase
      .from('posts')
      .select('*')
      .eq('slug', slug)
      .single();
    if (error) throw error;
    return PostDto.fromJson(data);
  }
}
