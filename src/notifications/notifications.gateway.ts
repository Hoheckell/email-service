// src/notifications/notifications.gateway.ts
import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { getSupabaseClient } from '../supabase/supabase.client';
import { JwtService } from '@nestjs/jwt';

@WebSocketGateway({
  cors: {
    origin: '*', // Ajuste para produção
  },
  namespace: '/notifications', // Separa do resto da API
})
export class NotificationsGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  constructor(private jwtService: JwtService) {}

  async handleConnection(client: Socket) {
    try {
      // O Flutter envia o token assim: io('URL', { extraHeaders: { Authorization: 'Bearer ...' } })
      const token = client.handshake.headers.authorization?.split(' ')[1];
      const userIdFromQuery = client.handshake.query.userId; // Fallback ou confirmação

      if (!token) {
        console.log('Cliente sem token desconectado');
        client.disconnect();
        return;
      }

      // Validamos o token para saber quem é de verdade
      // Isso impede que o João se conecte na sala da Maria
      const payload = this.jwtService.verify(token, {
        secret: process.env.SUPABASE_JWT_SECRET, // ou seu segredo JWT
      });

      const realUserId = payload.app_user_id || payload.sub;

      // COLOCAMOS O SOCKET NA "SALA" DO USUÁRIO
      const roomName = `user_${realUserId}`;
      await client.join(roomName);

      console.log(`Cliente ${client.id} entrou na sala: ${roomName}`);
    } catch (e) {
      console.error('Erro de conexão socket:', e.message);
      client.disconnect();
    }
  }

  sendToUser(userId: string, notificationData: any) {
    const roomName = `user_${userId}`;
    this.server.to(roomName).emit('new_notification', notificationData);
  }

  sendSystemNotification(userId: string, data: any) {
    this.sendToUser(userId, {
      ...data,
      sender_id: '00000000-0000-0000-0000-000000000000', // O "Zero" dos UUIDs
    });
  }

  handleDisconnect(client: Socket) {
    console.log(`Cliente desconectado: ${client.id}`);
  }
}
