import { User } from 'src/users/entities/user.entity';
import {Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, Timestamp, OneToMany, JoinColumn, ManyToOne} from 'typeorm'
import { OrderItem } from './order-item.entity';

export enum TransactionStatus {
    SUCCESS = 'success',
    PENDING = 'pending'
}

@Entity('transactions')
export class Transaction {
    @PrimaryGeneratedColumn('uuid')
    id: string;

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

    @Column({
        type: 'decimal',
        precision: 20,
        scale: 2,
        default: 0
    })
    amount: number;

    @Column({
        type: 'enum',
        enum: TransactionStatus,
        default: TransactionStatus.PENDING
    })
    transaction_status: TransactionStatus

    @Column({type: 'boolean', default: false, select: false})
    soft_deleted: boolean

    @ManyToOne(() => User, (user) => user.transactions)
    @JoinColumn({
        name: 'user_id',
        referencedColumnName: 'id',
        foreignKeyConstraintName: 'fk_transaction_user_id'
    })
    user: User

    @OneToMany(() => OrderItem, (order_item) => order_item.transaction)
    order_items: OrderItem[]
}
