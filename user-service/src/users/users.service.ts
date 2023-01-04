import { Injectable, Inject } from '@nestjs/common';
import { Repository, Like, FindOptionsWhere } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { GetUserDto } from './dto/get-users.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @Inject('USERS_REPOSITORY')
    private userRepository: Repository<User>
  ) {}
  async store(createUserDto: CreateUserDto): Promise<User> {
    return this.userRepository.save(createUserDto)
  }

  async findAll(getUserDTO: GetUserDto): Promise<User[]> {
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

  async findCount(getUserDTO: GetUserDto): Promise<number> {
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

  async findByEmail(email: string): Promise<User> {
    return this.userRepository.findOne({
      where: {
        email: email
      }
    })
  }

  async findOne(id: string): Promise<User> {
    return this.userRepository.findOneOrFail({
      where: {
        id: id
      }
    });
  }
}
