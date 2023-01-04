import { Injectable, Inject } from '@nestjs/common';
import { Repository } from 'typeorm/repository/Repository';
import { CreateProductDto } from './dto/create-product.dto';
import { GetProductDto } from './dto/get-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './entities/product.entity';
import { Constants } from './products.constant';
import { FindOptionsWhere, Like } from 'typeorm';

@Injectable()
export class ProductsService {

  constructor(
    @Inject(Constants.REPOSITORY)
    private productRepositoy: Repository<Product>
  ) {}

  findAll(getProductDto: GetProductDto) {
    const take = getProductDto.limit ?? 10
    const skip = ((getProductDto.page ?? 1) - 1) * take;
    let where: FindOptionsWhere<Product> | FindOptionsWhere<Product>[] | undefined    = {}
    if(getProductDto.keyword) {
      where = 
        {
          name: Like(`%${getProductDto.keyword}%`)
        }
    }
    return this.productRepositoy.find({
      where,
      take: take,
      skip: skip
    });
  }

  findCount(getProductDto: GetProductDto) {
    let where: FindOptionsWhere<Product> | FindOptionsWhere<Product>[] | undefined    = {}
    if(getProductDto.keyword) {
      where = 
        {
          name: Like(`%${getProductDto.keyword}%`)
        }
    }
    return this.productRepositoy.count({
      where
    });
  }

  async find(id: string): Promise<Product | null> {
    return await this.productRepositoy.findOne({where: {id: id}})
  }

  async create(createProductDto: CreateProductDto): Promise<Product> {
    return await this.productRepositoy.save({
      name: createProductDto.name,
      price: createProductDto.price
    })
  }
}
