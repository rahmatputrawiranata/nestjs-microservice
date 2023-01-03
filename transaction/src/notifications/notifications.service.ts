import { Inject, Injectable } from '@nestjs/common';
import { WebSocketServer } from '@nestjs/websockets';
import { Repository } from 'typeorm';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';
import { Notification } from './schema/notification.schema';
import { Server } from 'socket.io'

@Injectable()
export class NotificationsService {
  @WebSocketServer()
  private server: Server
  constructor(
    @Inject('NOTIFICATION_REPOSITORY')
    private notificationRepository: Repository<Notification>
  ) {}

  async create(createNotificationDto: CreateNotificationDto) {
    const notification = await this.notificationRepository.insert({
      to: createNotificationDto.user_id,
      title: createNotificationDto.title,
      content: createNotificationDto.content
    })
    return notification
  }

  findAll() {
    return `This action returns all notifications`;
  }
}
