import { Entity, Column, ObjectID, ObjectIdColumn } from "typeorm";

@Entity()
export class Notification {

    @ObjectIdColumn()
    id: ObjectID

    @Column()
    to: string;

    @Column()
    title: string;

    @Column()
    content: string;
    

}
