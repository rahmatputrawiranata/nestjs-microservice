import { WebSocketGateway, SubscribeMessage, MessageBody, WebSocketServer } from '@nestjs/websockets';
import { NotificationsService } from './notifications.service';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';
import { UseGuards } from '@nestjs/common';
import { WsGuard } from 'src/auth/guards/ws.guards';
import { JWTAuthGuard } from 'src/auth/guards/jwt-auth.guards';
import { Server } from 'socket.io'

@WebSocketGateway({
  cors: true
})
export class NotificationsGateway {
  @WebSocketServer()
  private server: Server
  constructor(
    private readonly notificationsService: NotificationsService,
  ) {}

  @SubscribeMessage('createNotification')
  async create(@MessageBody() createNotificationDto: CreateNotificationDto) {
    const notification =  await this.notificationsService.create(createNotificationDto);
    this.server.to(createNotificationDto.user_id).emit("receivedNotification", JSON.stringify(createNotificationDto))
  }

  @SubscribeMessage('findAllNotifications')
  findAll() {
    return this.notificationsService.findAll();
  }

  @SubscribeMessage('join')
  handleEvent(@MessageBody() data: string) {
    console.log(data)
    this.server.socketsJoin(data)
  }
}
