import { Injectable, NotAcceptableException, UnauthorizedException } from '@nestjs/common';
import { User } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';
import { LoginDTO } from './dto/login.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt/dist';
import { JwtPayload } from './interfaces/jwt-payload.interface';

@Injectable()
export class AuthService {
    constructor(private userService: UsersService, private jwtService: JwtService) {}

    async validateUser(email: string, password: string): Promise<User | null> {
        const user = await this.userService.findByEmail(email)
        if(!user) {
            throw new NotAcceptableException("This user not registered")
        }
        const passwordValid = await bcrypt.compare(password, user.password)
        if(!passwordValid) {
            throw new NotAcceptableException("Invalid Password")
        }
        return user
    }

    async generateToken(user: User) {
        const payload = {email: user.email, sub: user.id}
        return {
            access_token: this.jwtService.sign(payload)
        }
    }

    async verifyPayload(payload: JwtPayload): Promise<User> {
        let user: User;

        try{
            const isUser = await this.userService.findByEmail(payload.sub)
            if(isUser) {
                user = isUser
            }else{
                throw new UnauthorizedException('Invalid Token');
            }
        }catch(error) {
            throw new UnauthorizedException('Invalid Token');
        }
        return user;
    }

    signToken(user: User): string {
        const payload = {
          sub: user.email,
        };
    
        return this.jwtService.sign(payload);
    }
}
