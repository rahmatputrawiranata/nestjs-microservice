import { WebSocketGateway, SubscribeMessage, MessageBody, WebSocketServer } from '@nestjs/websockets';
import { NotificationsService } from './notifications.service';
import { CreateNotificationDto } from './dto/create-notification.dto';
import {MessagePattern} from '@nestjs/microservices'
import { Server } from 'socket.io'

@WebSocketGateway((process.env.NOTIFICATION_SERVER_PORT || 8005) as number, {
  cors: true
})
export class NotificationsGateway {
  @WebSocketServer()
  server: Server
  constructor(
    private readonly notificationsService: NotificationsService,
  ) {}

  @SubscribeMessage('createNotification')
  async create(@MessageBody() createNotificationDto: CreateNotificationDto) {
    await this.notificationsService.create(createNotificationDto);
    this.server.emit("receivedNotification", JSON.stringify(createNotificationDto));
  }

  @SubscribeMessage('findAllNotifications')
  findAll() {
    return this.notificationsService.findAll();
  }

  @SubscribeMessage('join')
  handleEvent(@MessageBody() data: string) {
    this.server.socketsJoin(data)
  }
}
