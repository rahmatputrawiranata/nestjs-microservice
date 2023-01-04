import { DataSource } from "typeorm";
import { OrderItem } from "./entities/order-item.entity";
import { Transaction } from "./entities/transaction.entity";
import { transactionConstant } from "./transaction.constant";

export const transactionProviders = [
    {
        provide: transactionConstant.REPOSITORY,
        useFactory: (dataSource: DataSource) => dataSource.getRepository(Transaction),
        inject: ['MYSQL_DATA_SOURCE']
    },
    {
        provide: transactionConstant.ORDER_ITEM_REPOSITORY,
        useFactory: (dataSource: DataSource) => dataSource.getRepository(OrderItem),
        inject: ['MYSQL_DATA_SOURCE']
    }
]