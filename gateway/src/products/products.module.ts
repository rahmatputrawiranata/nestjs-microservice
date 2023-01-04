import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ProductsController } from './products.controller';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'PRODUCT_SERVICE',
        transport: Transport.TCP,
        options: {
          host: process.env.PRODUCT_SERVICE_HOST || "0.0.0.0",
          port: (process.env.PRODUCT_SERVICE_PORT || 8002) as number
        }
      }
    ])
  ],
  controllers: [ProductsController]
})
export class ProductsModule {}
