import { CreateOrderItemDto } from "./create-order-items.dto";

export class CreateTransactionDto {
    user_id: string;
    order_items: CreateOrderItemDto[]
}