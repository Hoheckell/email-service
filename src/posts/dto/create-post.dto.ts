import { 
  IsString, 
  IsNotEmpty, 
  IsOptional, 
  MaxLength, 
  IsEnum, 
  IsDateString, 
  Matches 
} from 'class-validator';
import { PostStatus } from '../../enums/post-status.enum';

export class CreatePostDto {
  @IsString({ message: 'O título deve ser uma string' })
  @IsNotEmpty({ message: 'O título é obrigatório' })
  @MaxLength(255, { message: 'O título não pode ter mais de 255 caracteres' })
  title: string;

  @IsString({ message: 'O slug deve ser uma string' })
  @IsNotEmpty({ message: 'O slug é obrigatório' })
  @MaxLength(255)
  @Matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, { 
    message: 'O slug deve conter apenas letras minúsculas, números e hifens' 
  })
  slug: string;

  @IsString({ message: 'O conteúdo deve ser uma string' })
  @IsNotEmpty({ message: 'O conteúdo é obrigatório' })
  content: string;

  @IsString()
  @IsOptional()
  excerpt?: string;

  @IsString()
  @IsOptional()
  @MaxLength(500)
  coverImage?: string;

  @IsEnum(PostStatus, { message: 'O status deve ser RASCUNHO ou PUBLICADO' })
  @IsOptional()
  status?: PostStatus;

  @IsDateString({}, { message: 'A data de publicação deve estar em um formato válido (ISO 8601)' })
  @IsOptional()
  publishedAt?: string;
}