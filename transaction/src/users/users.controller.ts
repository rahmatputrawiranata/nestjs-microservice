import { Controller, Get, Post, Body, Patch, Param, Delete, HttpStatus, Res, Query } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Response} from 'express'
import { GetUserDTO } from './dto/get-users.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  async findAll(@Query() query: GetUserDTO, @Res() res: Response) {
    const users = await this.usersService.findAll(query)
    const count = await this.usersService.findCount(query)
    res.status(HttpStatus.OK).json({
      status: true,
      resp_data: {
        total_item: count,
        data: users
      }
    });
  }
}
