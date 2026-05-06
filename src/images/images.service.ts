import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { getSupabaseClient } from '../supabase/supabase.client';
import { IImage } from './interfaces/images.interface';

@Injectable()
export class ImagesService {
    

  async listPostImages(): Promise<IImage[]> {
    const supabase = getSupabaseClient();
    const bucketName = 'users';
    const folderPath = 'posts';

    const { data, error } = await supabase.storage
      .from(bucketName)
      .list(folderPath, {
        limit: 100, // Ajuste o limite conforme necessário
        offset: 0,
        sortBy: { column: 'created_at', order: 'desc' }, // Ordena pelos mais recentes
      });

    if (error) {
      throw new InternalServerErrorException(
        `Erro ao buscar imagens no Supabase: ${error.message}`,
      );
    }

    const validFiles = data.filter((file) => file.name !== '.emptyFolderPlaceholder');

    const imagesWithUrls: IImage[] = validFiles.map((file) => {
      const { data: urlData } = supabase.storage
        .from(bucketName)
        .getPublicUrl(`${folderPath}/${file.name}`);

      return {
        id: file.id || undefined,
        name: file.name || undefined,
        created_at: file.created_at || undefined,
        metadata: file.metadata || undefined,
        url: urlData.publicUrl || undefined, // URL para visualizar/baixar a imagem
      };
    });

    return imagesWithUrls;
  }
}
