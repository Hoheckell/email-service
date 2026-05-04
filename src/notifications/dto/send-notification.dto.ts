import { IsNotEmpty, IsNumber, IsString, IsOptional } from 'class-validator';

export class SendNotificationDto {
  @IsNotEmpty()
  @IsNumber() // O ID da turma costuma ser manipulado, mas se sua rota usa ID numérico, ajuste aqui
  turmaId: number; 

  @IsNotEmpty()
  @IsString()
  titulo: string;

  @IsString()
  conteudo: string;
  
  // Opcional: Link para onde o app deve abrir
  @IsOptional()
  metadata?: Record<string, any>; 
}