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
}
