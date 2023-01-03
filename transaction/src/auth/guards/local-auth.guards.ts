import { AuthGuard } from "@nestjs/passport";
import { Injectable, ExecutionContext } from '@nestjs/common'
@Injectable()
export class LocalAuthGuard extends AuthGuard('local') {
    async canActivate(context: ExecutionContext): Promise<boolean> {
        const result = (await super.canActivate(context)) as boolean

        if(context.getType() === 'http') {
            const request = context.switchToHttp().getRequest();
            await super.logIn(request)
        }

        return result;
    }
}