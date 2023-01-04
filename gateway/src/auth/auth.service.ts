import { Injectable } from '@nestjs/common';
import { BadRequestException, UnauthorizedException } from '@nestjs/common/exceptions';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcrypt'
import { JwtPayload } from 'src/interfaces/jwt-payload';
import { User } from 'src/interfaces/user';
@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService,
    ) {}

    async validateUser(loginDto: LoginDto): Promise<User> {
        const user = await this.usersService.findByEmail(loginDto.email)
        if(!user) {
            throw new BadRequestException("Invalid Email Address")
        }

        const validatePassword = await bcrypt.compare(loginDto.password, user.password)
        if(!validatePassword) {
            throw new BadRequestException("Invalid Password")
        }

        return user;
    }

    async generateToken(user: User) {
        const payload = {email: user.email, sub: user.id}
        return {
            access_token: this.jwtService.sign(payload)
        }
    }

    async verifyPayload(payload: JwtPayload): Promise<User> {

        let user: User;
        try {
            const isUser = await this.usersService.findByEmail(payload.sub)
            if(isUser) {
                user = isUser
            }else{
                throw new UnauthorizedException("Invalid Token")
            }
        }catch(error) {
            throw new UnauthorizedException("Invalid Token")
        }
        return user;
    }

    signToken(user: User): string {
        const payload = {
            sub: user.email
        }

        return this.jwtService.sign(payload)
    }
}
