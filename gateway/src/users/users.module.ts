import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { Transport, ClientsModule } from '@nestjs/microservices';
import { UsersService } from './users.service';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'USER_SERVICE',
        transport: Transport.TCP,
        options: {
          host: process.env.USER_SERVICE_HOST || "0.0.0.0",
          port: (process.env.USER_SERVICE_PORT || 8001) as number
        }
      }
    ])
  ],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService]
})
export class UsersModule {}
