import {IsNotEmpty, IsString, IsNumber} from 'class-validator'

export class ProcessTransactionDto {
    @IsNotEmpty()
    @IsString()
    user_id: string;

    @IsString()
    @IsNotEmpty()
    transaction_id: string;

    @IsNumber()
    @IsNotEmpty()
    amount: number;
    
}