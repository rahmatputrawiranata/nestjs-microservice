import { Controller, Inject } from '@nestjs/common';
import { ClientProxy, MessagePattern } from '@nestjs/microservices';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { ProcessTransactionDto } from './dto/process-transaction.dto';
import { Transaction } from './entities/transaction.entity';
import { TransactionService } from './transaction.service';

@Controller('transaction')
export class TransactionController {
    constructor(
        private readonly transactionService: TransactionService,
        @Inject('NOTIFICATION_SERVICE')
        private notificationsClient: ClientProxy
    ) {}
    @MessagePattern('create')
    async create(createTransactionDto: CreateTransactionDto): Promise<{
        status: boolean,
        data?: Transaction,
        message: string
    }> {
        try {
            const transaction = await this.transactionService.create(createTransactionDto)
            return {
                status: true,
                data: transaction,
                message: 'success'
            }
        } catch (error) {
            return {
                status: false,
                message: error.message
            }
        }
    }

    @MessagePattern('process')
    async process(processTransactionDto: ProcessTransactionDto): Promise<{status: boolean, message: string}> {
        try{
            await this.transactionService.process({
                user_id: processTransactionDto.user_id,
                amount: processTransactionDto.amount,
                transaction_id: processTransactionDto.transaction_id
            })
            return {
                status: true,
                message: 'Your transaction will be processed'
            }
        }catch(error){
            return {
                status: false,
                message: error.message
            }
        }
    }
}
