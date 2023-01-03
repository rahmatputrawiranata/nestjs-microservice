import { Product } from 'src/products/entities/product.entity';
import { User } from 'src/users/entities/user.entity';
import {Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, Timestamp, ManyToOne, JoinColumn} from 'typeorm'
import { Transaction } from './transaction.entity';

@Entity('order_items')
export class OrderItem {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({
        zerofill: false
    })
    quantity: number; 

    @Column({
        type: 'decimal',
        precision: 20,
        scale: 2,
        default: 0
    })
    total_amount: number;

    @CreateDateColumn({
        default: Timestamp
    })
    created_at: Date

    @Column({
        type: Date,
        nullable: true,
        default: null
    })
    updated_at: Date

    @Column({type: 'boolean', default: false, select: false})
    soft_deleted: boolean

    @ManyToOne(() => User, (user) => user.order_items)
    @JoinColumn({
        name: 'user_id',
        referencedColumnName: 'id',
        foreignKeyConstraintName: 'fk_order_items_user_id'
    })
    user: User

    @ManyToOne(() => Transaction)
    @JoinColumn({
        name: 'transaction_id',
        referencedColumnName: 'id',
        foreignKeyConstraintName: 'fk_order_items_transaction_id'
    })
    transaction: Transaction

    @ManyToOne(() => Product) 
    @JoinColumn({
        name: 'product_id',
        referencedColumnName: 'id',
        foreignKeyConstraintName: 'fk_order_items_product_id'
    })
    product: Product
}
