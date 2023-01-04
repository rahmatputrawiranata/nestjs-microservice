import { NestFactory } from '@nestjs/core';
import { Transport, MicroserviceOptions } from '@nestjs/microservices';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(AppModule, {
    transport: Transport.TCP,
    options: {
      host: process.env.USER_SERVICE_HOST || "0.0.0.0",
      port: (process.env.USER_SERVICE_PORT || 8001) as number 
    }
  })
  app.listen()
}
bootstrap();
