import {Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, Timestamp, Unique} from 'typeorm'

@Entity('products')
export class Product {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    name: string

    @Column({
        type: 'decimal',
        precision: 20,
        scale: 2,
        default: 0
    })
    price: number;

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
}
