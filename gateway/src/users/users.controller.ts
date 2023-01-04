import { Controller, Get, Inject, Query } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { getUserDto } from './dto/get-user.dto';
import { firstValueFrom } from 'rxjs';
@Controller('users')
export class UsersController {
    constructor(
        @Inject('USER_SERVICE') private usersClient: ClientProxy
    ) {}
    @Get()
    async get(@Query() getUserDto: getUserDto) {

        const resp: {
            data: {
             id: string
             name: string
             email: string
            }[],
            total_item: number
        } = await firstValueFrom(
            this.usersClient.send('get', getUserDto ?? {})
        )
        return {
            statusCode: 200,
            message: 'success',
            resp_data: resp
        }
    }

}
