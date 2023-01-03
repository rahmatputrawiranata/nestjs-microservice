import { DataSource } from "typeorm";
import { Notification } from "./schema/notification.schema";

export const notificationsProviders = [
    {
        provide: 'NOTIFICATION_REPOSITORY',
        useFactory: (dataSource: DataSource) => dataSource.getRepository(Notification),
        inject: ['MONGO_DATA_SOURCE']
    }
]