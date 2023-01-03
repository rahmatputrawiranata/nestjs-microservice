import {DataSource} from 'typeorm'
import 'dotenv/config'

export const databaseProviders = [
    {
        provide: 'MYSQL_DATA_SOURCE',
        useFactory: async() => {
            const dataSource = new DataSource({
                type: 'mysql',
                host: process.env.DATABASE_HOST,
                port: Number(process.env.DATABASE_PORT),
                username: process.env.DATABASE_USER,
                password: process.env.DATABASE_PASSWORD,
                database: process.env.DATABASE_DB,
                synchronize: true,
                dropSchema: false,
                logging: false,
                entities: ['dist/**/*.entity.js'],
            })

            return dataSource.initialize();
        }
    },
    {
        provide: 'MONGO_DATA_SOURCE',
        useFactory: async() => {
            const dataSource = new DataSource({
                type: 'mongodb',
                host: process.env.MONGO_DATABASE_HOST,
                port: Number(process.env.MONGO_DATABASE_PORT),
                useUnifiedTopology: true,
                database: process.env.MONGO_DATABASE_NAME,
                synchronize: true,
                dropSchema: false,
                logging: true,
                entities: ['dist/**/*.schema.js'],
            })

            return dataSource.initialize();
        }
    }
]