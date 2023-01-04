import { Controller, Get, Post, Body, UseGuards, Query, Res, HttpStatus } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { GetProductDto } from './dto/get-product.dto';
import { Response } from 'express';
import { MessagePattern } from '@nestjs/microservices';
import { Product } from './entities/product.entity';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @MessagePattern('get')
  async findAll(getProductDto: GetProductDto): Promise<{data: Product[], total_item: number}> {
    const data = await this.productsService.findAll(getProductDto)
    const count = await this.productsService.findCount(getProductDto)
    return {
      data,
      total_item: count
    }
  }

  @MessagePattern('create')
  async create(@Body() createProductDto:CreateProductDto): Promise<{data: Product}> {
    const data = await this.productsService.create(createProductDto)
    return {
      data: data
    }
  }

}
