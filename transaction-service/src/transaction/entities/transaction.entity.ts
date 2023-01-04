import {Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, Timestamp } from 'typeorm'

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

    @Column()
    user_id: string

    @Column()
    order_item_id: string;
}
