import { Controller, UseGuards, Post, Request, Body, Res, HttpStatus } from '@nestjs/common';
import { Inject } from '@nestjs/common/decorators';
import { ClientProxy } from '@nestjs/microservices';
import { Response } from 'express';
import { firstValueFrom } from 'rxjs';
import { JWTAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { ProcessTransactionDto } from './dto/process-transaction.dto';

@UseGuards(JWTAuthGuard)
@Controller('transactions')
export class TransactionsController {

    constructor(
        @Inject('TRANSACTION_SERVICE')
        private transactionsClient: ClientProxy
    ) {}

    @Post('/')
    async create(@Request() req: {user: {user_id: string}}, @Body() createOrderItemDto: CreateTransactionDto, @Res() res: Response) {
        try {
            const transaction: {
                status: boolean,
                data?: void,
                message: string
            } = await firstValueFrom(
                this.transactionsClient.send('create', {
                    user_id: req.user.user_id,
                    ...createOrderItemDto
                })
            )

            if(!transaction.status) {
                throw new Error(transaction.message)
            }
            res.status(HttpStatus.OK).json({
                status: true,
                resp_data: transaction.data
              });
        } catch (error) {
            console.log(error, '@error')
            res.status(HttpStatus.BAD_REQUEST).json({
                status: false,
                message: error.message
            })
        }
    }

    @Post('/process')
    async process(@Request() req: {user: {user_id: string}}, @Body() input: ProcessTransactionDto, @Res() res: Response) {
        try{
            const processTransaction: {
                status: boolean,
                message: string
            } = await firstValueFrom(
                this.transactionsClient.send('process', {
                    user_id: req.user.user_id,
                    amount: input.amount,
                    transaction_id: input.transaction_id
                })
            )

            if(!processTransaction.status) {
                throw new Error(processTransaction.message)
            }
            res.status(HttpStatus.OK).json({
                status: true,
                message: 'Your Payment will be processed'
            })
        }catch(error){
            res.status(HttpStatus.BAD_REQUEST).json({
                status: false,
                message: error.message
            })
        }
    }
}
