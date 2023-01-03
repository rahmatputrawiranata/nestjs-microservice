import { OrderItem } from 'src/transaction/entities/order-item.entity';
import { Transaction } from 'src/transaction/entities/transaction.entity';
import {Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, Timestamp, Unique, OneToMany} from 'typeorm'

@Entity('users')
@Unique('my_unique_constrains', ['email'])
export class User {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    name: string

    @Column({
        type: String,
        unique: true
    })
    email: string

    @Column()
    password: string

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

    @OneToMany(() => OrderItem, (order_item) => order_item.user)
    order_items: OrderItem[]

    @OneToMany(() => OrderItem, (transaction) => transaction.user)
    transactions: Transaction[]
}
