import { Module } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { NotificationsGateway } from './notifications.gateway';
import { DatabaseModule } from 'src/database/database.module';
import { notificationsProviders } from './notifications.providers';
import { NotificationsController } from './notifications.controller';

@Module({
  imports: [DatabaseModule],
  providers: [...notificationsProviders, NotificationsGateway, NotificationsService],
  exports: [NotificationsService, NotificationsGateway],
  controllers: [NotificationsController]
})
export class NotificationsModule {}
