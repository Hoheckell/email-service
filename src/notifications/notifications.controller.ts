import {
  Controller,
  Get,
  Patch,
  Post,
  Body,
  Request,
  ForbiddenException,
  UseGuards,
} from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { SendNotificationDto } from './dto/send-notification.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Post('send')
  async sendManualNotification(
    @Body() dto: SendNotificationDto,
    @Request() req,
  ) {
    const user = req.user;

    // 1. Segurança: Só professor pode enviar
    if (user.role !== 'PROFESSOR') {
      throw new ForbiddenException(
        'Apenas professores podem enviar avisos manuais.',
      );
    }

    // 2. Chama o serviço passando quem está enviando (ID do professor)
    // Usamos o ID numérico (user.sub ou buscamos no banco) dependendo da sua estratégia de JWT
    return this.notificationsService.sendToClass(user.userId, dto);
  }

  @Get()
  getNotifications(@Request() req) {
    return this.notificationsService.getNotifications(req.user.userId, req.user.role);
  }

  @Get('unread-count')
  getUnreadCount(@Request() req) {
    return this.notificationsService.getUnreadCount(req.user.userId, req.user.role);
  }

  @Patch(':id/read')
  markAsRead(@Body('id') id: string, @Request() req) {
    return this.notificationsService.markAsRead(id, req.user.userId, req.user.role);
  }

  @Patch('read-all')
  markAllAsRead(@Request() req) {
    return this.notificationsService.markAllAsRead(req.user.userId, req.user.role);
  }
}
