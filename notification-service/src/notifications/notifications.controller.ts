import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices'
import { CreateNotificationDto } from './dto/create-notification.dto';
import { NotificationsGateway } from './notifications.gateway';
@Controller('notifications')
export class NotificationsController {

    constructor(
        private notificationGateway: NotificationsGateway
    ) {}

    @MessagePattern('create')
    async create(createNotificationDto: CreateNotificationDto) {
        this.notificationGateway.server.emit('receivedNotification', JSON.stringify(createNotificationDto))
    }
}
