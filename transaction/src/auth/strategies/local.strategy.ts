import {Injectable, UnauthorizedException} from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthService } from '../auth.service';
import { LoginDTO } from '../dto/login.dto';
@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy, 'local') {
    constructor(private authService: AuthService) {
        super();
    }

    async validate(loginDTO: LoginDTO): Promise<{access_token: string} | UnauthorizedException> {
        const user = await this.authService.validateUser(loginDTO.email, loginDTO.password)
        if(!user) {
            throw new UnauthorizedException();
        }
        return await this.authService.generateToken(user)
    }
}