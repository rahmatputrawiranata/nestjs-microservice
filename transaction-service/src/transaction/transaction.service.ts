import { Injectable, Inject } from '@nestjs/common';
import { Transaction, TransactionStatus } from './entities/transaction.entity';
import { transactionConstant } from './transaction.constant';
import { Repository, DataSource, EntityManager } from 'typeorm';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { OrderItem } from './entities/order-item.entity';
import { ProcessTransactionDto } from './dto/process-transaction.dto';
import { ClientProxy } from '@nestjs/microservices';
import {firstValueFrom} from 'rxjs'
import { Product } from 'src/interfaces/product';
@Injectable()
export class TransactionService {

    constructor(
        @Inject(transactionConstant.REPOSITORY)
        private transactionRepository: Repository<Transaction>,
        @Inject('MYSQL_DATA_SOURCE')
        private dataSource: DataSource,
        @Inject('PRODUCT_SERVICE')
        private productsClient: ClientProxy,
        @Inject('NOTIFICATION_SERVICE')
        private notificationClient: ClientProxy
    ) {}

    async create(createTransactionDto: CreateTransactionDto): Promise<Transaction | null> {
        // check is product valid or not and create new constant data 
        const orderItemProduct: {
            product_id: string,
            price: number,
            quantity: number,
            total_amount: number
        }[] = []
        await Promise.all(
            createTransactionDto.order_items.map(async(order_item) => {
                const product: {data: Product} = await firstValueFrom(
                    this.productsClient.send('findById', order_item.product_id)
                ); 

                if(!product?.data) {
                    throw new Error("Invalid Product Id")
                }else{
                    orderItemProduct.push({
                        product_id: order_item.product_id,
                        price: product.data.price,
                        quantity: order_item.quantity,
                        total_amount: product.data.price * order_item.quantity
                    })
                }
            })
        )
        const queryRunner = this.dataSource.createQueryRunner()
        await queryRunner.connect()
        await queryRunner.startTransaction()
        let res: Transaction | null = null
        try {
            const transaction = await queryRunner.manager.save(Transaction, {
                user_id: createTransactionDto.user_id
            })

            let transaction_amount = 0;
            
            await Promise.all(
                orderItemProduct.map(async(order_item) => {
                    await queryRunner.manager.save(OrderItem, {
                        product_id: order_item.product_id,
                        user_id: createTransactionDto.user_id,
                        transaction_id: transaction.id,
                        quantity: order_item.quantity,
                        total_amount: order_item.total_amount
                    })

                    transaction_amount += order_item.total_amount
                })
            )
            
            await queryRunner.manager.update(Transaction, {
                id: transaction.id
            }, {
                amount: transaction_amount
            })
            
            await queryRunner.commitTransaction();
            const trxDetail = await this.transactionRepository.findOne({
                where: {
                    id: transaction.id
                }
            })
            
            res = trxDetail
            
            return res
        } catch (error) {
            await queryRunner.rollbackTransaction()
            throw new Error(error)
        } finally {
            await queryRunner.release()
        }
    }

    async process(processTransactionDto: ProcessTransactionDto) {
        try{
            const transaction = await this.transactionRepository.findOneByOrFail({
                id: processTransactionDto.transaction_id,
                user_id: processTransactionDto.user_id
            })
            if(!transaction) {
                throw 'Invalid Transaction Id'
            }

            // if(transaction.transaction_status !== TransactionStatus.PENDING) {
            //     throw 'This Transaction already processed'
            // }

            if(Number(transaction.amount) !== Number(processTransactionDto.amount)) {
                throw 'Invalid Payment Amount'
            }
            const trx = await this.transactionRepository.update({
                id: processTransactionDto.transaction_id
            }, {
                transaction_status: TransactionStatus.SUCCESS
            })

            this.notificationClient.emit('create', {
                user_id: processTransactionDto.user_id,
                title: `Transaction with id ${transaction.id} is success`,
                content: ''
            })

            // this.notificationsGateway.create({
            //     user_id: processTransactionDto.user_id,
            //     title: `Transaction with id ${transaction.id} is success`,
            //     content: ''
            // })

            return trx
        }catch(error) {
            throw new Error(error)
        }
        
    }

}
