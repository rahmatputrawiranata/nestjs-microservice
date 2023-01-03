import { Injectable, CanActivate } from "@nestjs/common";
import { Observable } from "rxjs";
import { UsersService } from "src/users/users.service";
import { jwtConstants } from "../auth.constants";
import { JwtService } from "@nestjs/jwt";

@Injectable()
export class WsGuard implements CanActivate {

  constructor(private userService: UsersService, private jwtService: JwtService) {
  }

  canActivate(
    context: any,
  ): boolean | any | Promise<boolean | any> | Observable<boolean | any> {
    const bearerToken = context.args[0].handshake.headers.authorization.split(' ')[1];
    try {
      const decoded = this.jwtService.verify(bearerToken, {secret: jwtConstants.secret});
      return new Promise((resolve, reject) => {
        return this.userService.findByEmail(decoded.email).then(user => {
          if (user) {
            resolve(user);
          } else {
            reject(false);
          }
        });

      });
    } catch (ex) {
      console.log(ex);
      return false;
    }
  }
}