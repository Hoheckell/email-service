import { Module } from '@nestjs/common';
import { MateriaisService } from './materiais.service';
import { MateriaisController } from './materiais.controller';
import { NotificationsGateway } from '../notifications/notifications.gateway';
import { JwtService } from '@nestjs/jwt';

@Module({
  providers: [MateriaisService,NotificationsGateway, JwtService],
  exports: [MateriaisService],
  controllers: [MateriaisController]
})
export class MateriaisModule {}
