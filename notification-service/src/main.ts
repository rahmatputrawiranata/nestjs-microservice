import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(AppModule, {
    transport: Transport.TCP,
    options: {
      host: process.env.PRODUCT_SERVICE_HOST || "0.0.0.0",
      port: (process.env.PRODUCT_SERVICE_PORT || 8004) as number 
    }
  })
  app.listen()

  // const httpServer = await NestFactory.create(AppModule);
  // httpServer.enableCors();
  // await httpServer.listen((process.env.NOTIFICATION_SERVER_PORT || 8005) as number);
  // httpServer.useGlobalPipes(new ValidationPipe())
}
bootstrap();
