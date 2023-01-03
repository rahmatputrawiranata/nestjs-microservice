import { Module } from '@nestjs/common';
import { TransactionController } from './transaction.controller';
import { TransactionService } from './transaction.service';
import { DatabaseModule } from 'src/database/database.module';
import { transactionProviders } from './transaction.providers';
import {DataSource} from 'typeorm'
import { databaseProviders } from 'src/database/database.providers';
import { ProductsModule } from 'src/products/products.module';
import { UsersModule } from 'src/users/users.module';
import { NotificationsModule } from 'src/notifications/notifications.module';

@Module({
  imports: [DatabaseModule, ProductsModule, UsersModule, NotificationsModule],
  controllers: [TransactionController],
  providers: [
    ...transactionProviders,
    TransactionService
  ],
  exports: [TransactionService]
})
export class TransactionModule {}
