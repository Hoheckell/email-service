import { Type } from "class-transformer";
import { IsOptional, IsNumber, IsNotEmpty, IsString, IsDate } from "class-validator";
import { PostEntity } from "../entity/post.entity";
import { IPost } from "../interface/post.interface";
import { PostStatus } from "../../enums/post-status.enum";

export class PostDto {
    @IsOptional()
    @IsString()
    id?: string;
    
    @IsNotEmpty({ message: 'Título é obrigatório' })
    @IsString()
    title: string;

    @IsNotEmpty({ message: 'Slug é obrigatório' })
    @IsString()
    slug: string;

    @IsNotEmpty({ message: 'Conteúdo é obrigatório' })
    @IsString()
    content: string;

    @IsOptional()
    @IsString()
    excerpt: string;

    @IsOptional()
    @IsString()
    coverImage: string;

    @IsOptional()
    @IsString()
    status: PostStatus;

    @IsOptional()
    @Type(() => Date)
    @IsDate()
    created_at?: Date | null;

    @IsOptional()
    @Type(() => Date)
    @IsDate()
    updated_at?: Date | null;

    @IsOptional()
    @Type(() => Date)
    @IsDate()
    published_at?: Date | null;


    toEntity(): PostEntity {
        const entity = new PostEntity();
        entity.id = this.id;
        entity.title = this.title;
        entity.slug = this.slug;
        entity.content = this.content;
        entity.excerpt = this.excerpt ?? '';
        entity.coverImage = this.coverImage ?? '';
        entity.status = this.status;
        entity.createdAt = this.created_at ?? new Date();
        entity.updatedAt = this.updated_at ?? null;
        entity.published_at = this.published_at ?? null;
        return entity;
    }

    static fromEntity(entity: PostEntity): PostDto {
        const dto = new PostDto();
        dto.id = entity.id;
        dto.title = entity.title;
        dto.slug = entity.slug;
        dto.content = entity.content;
        dto.excerpt = entity.excerpt;
        dto.coverImage = entity.coverImage;
        dto.status = entity.status;
        dto.created_at = entity.createdAt;
        dto.updated_at = entity.updatedAt;
        dto.published_at = entity.published_at;
        return dto;
    }

    static fromJson(json: IPost): PostDto {
        const dto = new PostDto();
        dto.id = json.id;
        dto.title = json.title;
        dto.slug = json.slug;
        dto.content = json.content;
        dto.excerpt = json.excerpt ?? '';
        dto.coverImage = json.coverImage ?? '';
        dto.status = json.status ?? '';
        dto.created_at = json.created_at ?? null;
        dto.updated_at = json.updated_at ?? null;
        dto.published_at = json.published_at ?? null;
        return dto;
    }
}