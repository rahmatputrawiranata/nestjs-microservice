import { Controller, Post, Body, HttpStatus, Get, UseGuards, HttpCode, UseInterceptors, Request } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { UsersService } from 'src/users/users.service';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { Res } from '@nestjs/common/decorators/http/route-params.decorator';
import { Response } from 'express';
import { JwtStrategy } from './strategies/jwt.strategy';
import { JWTAuthGuard } from './guards/jwt-auth.guard';

@Controller('auth')
export class AuthController {
    constructor(
        private readonly userService: UsersService, 
        private readonly authService: AuthService, 
        private readonly jwtStrategy: JwtStrategy
    ){}

    @Post('/register')
    async createUser(
        @Body() createUserDTO: CreateUserDto,
        @Res() res: Response
    ) {
        const user = await this.userService.create(createUserDTO)
        const jwt = await this.authService.generateToken(user)
        res.status(HttpStatus.OK).json({
            status: true,
            message: 'success',
            resp_data: jwt
        })
    }

    @Post('/login')
    async login(@Body() LoginDto: LoginDto, @Res() res: Response) {
        const jwt = await this.jwtStrategy.validateAndGenerateTokenUser(LoginDto)
        res.status(HttpStatus.OK).json({
            status: true,
            message: 'success',
            resp_data: jwt
        })
    }

    @UseGuards(JWTAuthGuard)
    @Get('profile')
    async getProfile(@Request() req: {user: {user_id: string, email: string}}, @Res() res: Response) {
        res.status(HttpStatus.OK).json({
            status: true,
            message: 'success',
            resp_data: req.user
        })
    }
}
