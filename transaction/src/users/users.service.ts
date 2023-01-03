import { Injectable, Inject } from '@nestjs/common';
import { BadRequestException } from '@nestjs/common/exceptions/bad-request.exception';
import { HttpException } from '@nestjs/common/exceptions/http.exception';
import { Repository, Like, FindOptionsWhere } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { GetUserDTO } from './dto/get-users.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @Inject('USERS_REPOSITORY')
    private userRepository: Repository<User>
  ) {}
  async create(createUserDto: CreateUserDto): Promise<User> {
    // const user = new this.userRepository()
    const user = await this.findByEmail(createUserDto.email)
    if(user) {
      throw new BadRequestException('Email already registered', { cause: new Error(), description: 'Some error description' })
    }
    const saltOrRounds = 10;
    const hashedPassword = await bcrypt.hash(createUserDto.password, saltOrRounds)
    return this.userRepository.save({...createUserDto, password: hashedPassword})
  }

  findAll(getUserDTO: GetUserDTO) {
    const take = getUserDTO.limit ?? 10
    const skip = ((getUserDTO.page ?? 1) - 1) * take;
    let where: FindOptionsWhere<User> | FindOptionsWhere<User>[] | undefined    = {}
    if(getUserDTO.keyword) {
      where = [
        {
          name: Like(`%${getUserDTO.keyword}%`)
        },
        {
          email: Like(`%${getUserDTO.keyword}%`)
        }
      ]
    }
    return this.userRepository.find({
      where,
      take: take,
      skip: skip
    });
  }

  findCount(getUserDTO: GetUserDTO) {
    let where: FindOptionsWhere<User> | FindOptionsWhere<User>[] | undefined    = {}
    if(getUserDTO.keyword) {
      where = [
        {
          name: Like(`%${getUserDTO.keyword}%`)
        },
        {
          email: Like(`%${getUserDTO.keyword}%`)
        }
      ]
    }
    return this.userRepository.count({
      where
    })
  }

  findByEmail(email: string) {
    return this.userRepository.findOne({
      where: {
        email: email
      }
    })
  }

  findOne(id: string) {
    return this.userRepository.findOneOrFail({
      where: {
        id: id
      }
    });
  }
}
