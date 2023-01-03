import { Controller, Get, Post, Body, UseGuards, Query, Res, HttpStatus } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { JWTAuthGuard } from 'src/auth/guards/jwt-auth.guards';
import { GetProductDto } from './dto/get-product.dto';
import { Response } from 'express';

@UseGuards(JWTAuthGuard)
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  async findAll(@Query() query: GetProductDto, @Res() res: Response) {
    const data = await this.productsService.findAll(query)
    const count = await this.productsService.findCount(query)
    res.status(HttpStatus.OK).json({ 
      status: true,
      resp_data: {
        total_item: count,
        data: data
      }
    });
  }

  @Post()
  async create(@Body() createProductDto:CreateProductDto, @Res() res: Response) {
    const data = await this.productsService.create(createProductDto)
    res.status(HttpStatus.OK).json({
      status: true,
      resp_data: {
        data
      }
    })
  }

}
