import { Controller, UseGuards, Post, Body, Res, HttpStatus, Request } from '@nestjs/common';
import { Response } from 'express';
import { JWTAuthGuard } from 'src/auth/guards/jwt-auth.guards';
import { UsersService } from 'src/users/users.service';
import { CreateOrderItemDto } from './dto/create-order-items.dto';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { ProcessTransactionDto } from './dto/process-transaction.dto';
import { TransactionService } from './transaction.service';

@UseGuards(JWTAuthGuard)
@Controller('transaction')
export class TransactionController {
    constructor(
        private readonly transactionService: TransactionService,
        private readonly userService: UsersService) {}
    @Post('/')
    async create(@Request() req: {user: {user_id: string}}, @Body() createOrderItemDto: CreateTransactionDto, @Res() res: Response) {
        try {
            const user = await this.userService.findOne(req.user.user_id)
            const transaction = await this.transactionService.create({
                ...createOrderItemDto,
                user: user
            })
            res.status(HttpStatus.OK).json({
                status: true,
                resp_data: transaction
              });
        } catch (error) {
            res.status(HttpStatus.BAD_REQUEST).json({
                status: false,
                message: error.message
            })
        }
    }

    @Post('/process')
    async process(@Request() req: {user: {user_id: string}}, @Body() input: ProcessTransactionDto, @Res() res: Response) {
        try{
            await this.transactionService.process({
                user_id: req.user.user_id,
                amount: input.amount,
                transaction_id: input.transaction_id
            })
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
