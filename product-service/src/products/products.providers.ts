import { DataSource } from "typeorm";
import { Product } from "./entities/product.entity";
import { Constants } from "./products.constant";

export const productsProviders = [
    {
        provide: Constants.REPOSITORY,
        useFactory: (dataSource: DataSource) => dataSource.getRepository(Product),
        inject: ['MYSQL_DATA_SOURCE']
    }
]