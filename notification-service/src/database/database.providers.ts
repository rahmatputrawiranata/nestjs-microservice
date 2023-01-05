import {DataSource} from 'typeorm'
import 'dotenv/config'

export const databaseProviders = [
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