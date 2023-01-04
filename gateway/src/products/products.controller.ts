import { Controller, Get, Inject, Post, Query, Body, UseGuards } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { JWTAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { Product } from 'src/interfaces/product';
import { CreateProductDto } from './dto/create-product.dto';
import { GetProductsDto } from './dto/get-products.dto';

@UseGuards(JWTAuthGuard)
@Controller('products')
export class ProductsController {
    
    constructor(
        @Inject('PRODUCT_SERVICE')
        private productClient: ClientProxy
    ) {}
    @Get()
    async get(@Query() getProductsDto:GetProductsDto) {
        
        const data: {data: Product[], total_item: number} = await firstValueFrom(
            this.productClient.send('get', getProductsDto ?? {})
        )
        
        return {
            statusCode: 200,
            message: 'success',
            resp_data: data
        }
    }

    @Post()
    async create(@Body() createProductDto: CreateProductDto) {
        const data: {data: Product} = await firstValueFrom(
            this.productClient.send('create', createProductDto)
        )

        return {
            statusCode: 200,
            message: 'success',
            resp_data: data
        }
    }

}
