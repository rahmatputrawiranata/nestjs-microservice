import { Module } from '@nestjs/common';
import { NotificationsModule } from './notifications/notifications.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [NotificationsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
