import {ExecutionContext, Injectable, SetMetadata, UnauthorizedException} from '@nestjs/common';
import {AuthGuard} from "@nestjs/passport";
import {Reflector} from "@nestjs/core";

@Injectable()
export class JwtGuard extends AuthGuard('jwt') {
  constructor(private readonly reflector: Reflector) {
    super();
  }

  canActivate(context: ExecutionContext) {
    const isPublic = this.reflector.get<boolean>(
      'isPublic',
      context.getHandler(),
    );

    if (isPublic) {
      return true;
    }

    const request: Request | any = context.switchToHttp().getRequest();

    return super.canActivate(context);
  }

  handleRequest(err, user, info) {
    if (err || !user) {
      throw err || new UnauthorizedException();
    }
    return user;
  }
}

export const Public = () => SetMetadata('isPublic', true);
