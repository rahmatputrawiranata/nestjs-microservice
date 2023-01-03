import { IsNotEmpty, IsString, IsPositive, IsNumber } from "class-validator";

export class CreateOrderItemDto {
    @IsString()
    @IsNotEmpty()
    product_id: string;

    @IsNumber()
    @IsNotEmpty()
    @IsPositive()
    quantity: number;
}