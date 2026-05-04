// CREATE TABLE posts (
//   id BIGSERIAL PRIMARY KEY,
//   title VARCHAR(255) NOT NULL,
//   slug VARCHAR(255) UNIQUE NOT NULL,
//   content TEXT NOT NULL, -- HTML
//   excerpt TEXT,
//   cover_image VARCHAR(500),
//   status VARCHAR(20) DEFAULT 'draft', -- draft | published
//   created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
//   updated_at TIMESTAMP,
//   published_at TIMESTAMP
// );

import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, Index, UpdateDateColumn } from 'typeorm';
import { PostDto } from '../dto/post.dto';
import { PostStatus } from '../../enums/post-status.enum';
@Entity('posts')
export class PostEntity {
  @PrimaryGeneratedColumn('uuid')
  id?: string;

  @Column({ type: 'varchar', length: 255 })
  title: string;

  @Index('idx_posts_slug')
  @Column({ type: 'varchar', length: 255, unique: true })
  slug: string;

  @Column({ type: 'text' })
  content: string;

  @Column({ type: 'text', nullable: true })
  excerpt: string;

  // Mantemos o nome coverImage exato como na sua tabela original
  @Column({ type: 'varchar', length: 500, nullable: true, name: 'coverImage' })
  coverImage: string;

  @Index('idx_posts_status')
  @Column({
    type: 'enum',
    enum: PostStatus,
    default: PostStatus.RASCUNHO,
    enumName: 'post_status_enum', // Diz ao TypeORM o nome exato do Enum no Postgres
  })
  status: PostStatus;

  @CreateDateColumn({ type: 'timestamp without time zone', name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp without time zone', name: 'updated_at', nullable: true })
  updatedAt?: Date | null;

  @Index('idx_posts_published')
  @Column({ type: 'timestamp without time zone', nullable: true })
  published_at?: Date | null;

    toDto(): PostDto {
        const dto = new PostDto();
        dto.id = this.id ?? '';
        dto.title = this.title;
        dto.slug = this.slug;
        dto.content = this.content;
        dto.excerpt = this.excerpt;
        dto.coverImage = this.coverImage;
        dto.status = this.status;
        dto.created_at = this.createdAt;
        dto.updated_at = this.updatedAt;
        dto.published_at = this.published_at;
        return dto;
    }

}