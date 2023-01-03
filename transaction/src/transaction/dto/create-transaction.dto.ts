import { IsString, IsNotEmpty, IsArray } from "class-validator";
import { User } from "src/users/entities/user.entity";
import { CreateOrderItemDto } from "./create-order-items.dto";

export class CreateTransactionDto {
    @IsNotEmpty()
    user: User;

    @IsArray()
    @IsNotEmpty()
    order_items: CreateOrderItemDto[]
}