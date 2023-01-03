import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from "@nestjs/common";
import { map, Observable } from "rxjs";
import { User } from "src/users/entities/user.entity";
import { AuthService } from "../auth.service";
import { Response } from "express";

@Injectable()
export class TokenInterceptor implements NestInterceptor {
    constructor(private readonly authService: AuthService) {}

    intercept(context: ExecutionContext, next: CallHandler<User>): Observable<User> | Promise<Observable<User>> {
        return next.handle().pipe(
            map(user => {
                const response = context.switchToHttp().getResponse<Response>();
                const token = this.authService.signToken(user)
                
                response.setHeader('Authorization', `Bearer ${token}`);
                response.cookie('token', token, {
                httpOnly: true,
                signed: true,
                sameSite: 'strict',
                secure: process.env.NODE_ENV === 'production',
                });

                return user;
            })
        )
    }

}