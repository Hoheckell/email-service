import { IsNotEmpty, IsNumber, IsString, IsOptional, IsDate } from 'class-validator';
import { Type } from 'class-transformer';
import { NotificationInterface } from '../interface/notification.interface';

export class NotificationDto {
  @IsNotEmpty()
  @IsNumber()
  id: number;

  @IsNotEmpty()
  @IsString()
  titulo: string;

  @IsString()
  conteudo: string;

  @IsNotEmpty()
  @IsString()
  recipient_id: string;

  @IsNotEmpty()
  @IsString()
  recipient_role: string;

  @IsNotEmpty()
  @IsString()
  is_read: boolean;

  @IsNotEmpty()
  @Type(() => Date)
  @IsDate()
  created_at: Date;

  @IsNotEmpty()
  @Type(() => Date)
  @IsDate()
  updated_at: Date;

  static fromJson(json: NotificationInterface): NotificationDto {
        const dto = new NotificationDto();
        dto.id = json.id;
        dto.titulo = json.titulo;
        dto.conteudo = json.conteudo;
        dto.recipient_id = json.recipient_id;
        dto.recipient_role = json.recipient_role;
        dto.is_read = json.is_read;
        dto.created_at = json.created_at;
        dto.updated_at = json.updated_at;
        return dto;
    }
}
