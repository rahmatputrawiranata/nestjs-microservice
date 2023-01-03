import { Module } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { NotificationsGateway } from './notifications.gateway';
import { AuthModule } from 'src/auth/auth.module';
import { DatabaseModule } from 'src/database/database.module';
import { notificationsProviders } from './notifications.providers';

@Module({
  imports: [AuthModule, DatabaseModule],
  providers: [...notificationsProviders, NotificationsGateway, NotificationsService],
  exports: [NotificationsService, NotificationsGateway]
})
export class NotificationsModule {}
