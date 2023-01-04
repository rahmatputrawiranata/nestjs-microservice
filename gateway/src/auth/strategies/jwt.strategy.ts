import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { CONSTANT } from '../constant';
import { AuthService } from '../auth.service';
import { LoginDto } from '../dto/login.dto';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private authService: AuthService
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: true,
      secretOrKey: CONSTANT.JWT_SECRET_KEY,
    });
  }

  async validateAndGenerateTokenUser(loginDto: LoginDto): Promise<{access_token: string} | UnauthorizedException> {
    const user = await this.authService.validateUser(loginDto)
    if(!user) {
        throw new UnauthorizedException();
    }
    return await this.authService.generateToken(user)
 }

 async validate(payload: {sub?: string, email: string}) {
    return { user_id: payload.sub, email: payload.email };
  }
}