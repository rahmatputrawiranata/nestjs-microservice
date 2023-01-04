import { NestFactory } from '@nestjs/core';
import { Transport, MicroserviceOptions } from '@nestjs/microservices';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(AppModule, {
    transport: Transport.TCP,
    options: {
      host: process.env.TRANSACTION_SERVICE_HOST || "0.0.0.0",
      port: (process.env.TRANSACTION_SERVICE_PORT || 8003) as number 
    }
  })
  app.listen()
}
bootstrap();
