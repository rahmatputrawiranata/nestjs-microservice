import { Controller } from '@nestjs/common';
import { UsersService } from './users.service';
import { Response} from 'express'
import { GetUserDto } from './dto/get-users.dto';
import {MessagePattern} from '@nestjs/microservices'; 
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @MessagePattern('get')
  async findAll(getUserDto: GetUserDto): Promise<{data: User[], total_item: number}> {
    console.log('pattern get')
    const users = await this.usersService.findAll(getUserDto)
    const count = await this.usersService.findCount(getUserDto)

    return {
      data: users,
      total_item: count
    }
  }

  @MessagePattern('create')
  async create(createUserDto: CreateUserDto): Promise<{data: User}> {
    console.log('pattern create')
    const user = await this.usersService.store(createUserDto)
    return {
      data: user
    }
  }

  @MessagePattern('findByEmail')
  async findByEmail(email:string): Promise<User> {
    console.log('pattern findByEmail')
    const user = await this.usersService.findByEmail(email)
    return user
  }

  @MessagePattern('user_find_by_id')
  async findById(id: string): Promise<{data: User}> {
    console.log('pattern user_find_by_id')
    const user = await this.usersService.findOne(id)
    return {
      data: user
    }
  }
}
