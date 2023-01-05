import { Module } from '@nestjs/common';
import { TransactionController } from './transaction.controller';
import { TransactionService } from './transaction.service';
import { DatabaseModule } from 'src/database/database.module';
import { transactionProviders } from './transaction.providers';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [
    DatabaseModule,
    ClientsModule.register([
      {
        name: 'USER_SERVICE',
        transport: Transport.TCP,
        options: {
          host: process.env.USER_SERVICE_HOST || "0.0.0.0",
          port: (process.env.USER_SERVICE_PORT || 8001) as number
        }
      },
      {
        name: 'PRODUCT_SERVICE',
        transport: Transport.TCP,
        options: {
          host: process.env.PRODUCT_SERVICE_HOST || "0.0.0.0",
          port: (process.env.PRODUCT_SERVICE_PORT || 8002) as number
        }
      },
      {
        name: 'NOTIFICATION_SERVICE',
        transport: Transport.TCP,
        options: {
          host: process.env.USER_SERVICE_HOST || "0.0.0.0",
          port: (process.env.USER_SERVICE_PORT || 8004) as number
        }
      }
    ])
  ],
  controllers: [TransactionController],
  providers: [
    ...transactionProviders,
    TransactionService
  ],
  exports: [TransactionService]
})
export class TransactionModule {}
