import { Injectable, Inject, BadRequestException } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { User } from 'src/interfaces/user';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';
@Injectable()
export class UsersService {
    constructor(
        @Inject('USER_SERVICE') private usersClient: ClientProxy
    ) {}
    async create(createUserDto: CreateUserDto): Promise<User> {
        const user = await this.findByEmail(createUserDto.email)
        if(user) {
          throw new BadRequestException('Email already registered', { cause: new Error(), description: 'Email already registered' })
        }
        const saltOrRounds = 10;
        const hashedPassword = await bcrypt.hash(createUserDto.password, saltOrRounds)
        const data: User = await firstValueFrom(
            this.usersClient.send('create', {...createUserDto, password: hashedPassword})
        )

        return data
    }

    async findByEmail(email: string): Promise<User> {
        const user: User = await firstValueFrom(
            this.usersClient.send('findByEmail', email)
        )
        return user;
    }

}
