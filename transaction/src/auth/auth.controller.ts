import { Controller, Post, Body, HttpStatus, Get, UseGuards, HttpCode, UseInterceptors, Request } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDTO } from './dto/login.dto';
import { UsersService } from 'src/users/users.service';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { Res } from '@nestjs/common/decorators/http/route-params.decorator';
import { Response } from 'express';
import { LocalStrategy } from './strategies/local.strategy';
import { JWTAuthGuard } from './guards/jwt-auth.guards';
import { User } from 'src/users/entities/user.entity';

@Controller('auth')
export class AuthController {
    constructor(
        private readonly userService: UsersService, 
        private readonly authService: AuthService, 
        private readonly localStrategy: LocalStrategy
    ){}

    @Post('/register')
    async createUser(
        @Body() createUserDTO: CreateUserDto,
        @Res() res: Response
    ) {
        const user = await this.userService.create(createUserDTO)
        // return user;
        const jwt = await this.authService.generateToken(user)
        res.status(HttpStatus.OK).json({
            status: true,
            message: 'success',
            resp_data: jwt
        })
    }

    @Post('/login')
    async login(@Body() loginDTO: LoginDTO, @Res() res: Response) {
        const jwt = await this.localStrategy.validate(loginDTO)
        res.status(HttpStatus.OK).json({
            status: true,
            message: 'success',
            resp_data: jwt
        })
    }

    @UseGuards(JWTAuthGuard)
    @Get('profile')
    async getProfile(@Request() req: {user: {user_id: string, email: string}}, @Res() res: Response) {
        console.log(req.user)
        res.status(HttpStatus.OK).json({
            status: true,
            message: 'success',
            resp_data: req.user
        })
    }
}
