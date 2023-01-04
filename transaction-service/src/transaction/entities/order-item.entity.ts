import {Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, Timestamp} from 'typeorm'

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

    @Column()
    user_id: string

    @Column()
    transaction_id: string

    @Column()
    product_id: string
}
