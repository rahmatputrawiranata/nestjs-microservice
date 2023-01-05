import { User } from "src/interfaces/user";
import { CreateOrderItemDto } from "./create-order-items.dto";

export class CreateTransactionDto {
    user: User;
    order_items: CreateOrderItemDto[]
}