import {CanActivate, ExecutionContext, Injectable, SetMetadata, UnauthorizedException} from '@nestjs/common';
import { Observable } from 'rxjs';
import {Reflector} from "@nestjs/core";
import { from } from 'shiro-perms'
import { isNil } from '@nestjs/common/utils/shared.utils';
import {MyLogger} from "./myLogger";

@Injectable()
export class ShiroPermsGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private myLogger: MyLogger
  ) {
    this.myLogger.setContext(ShiroPermsGuard.name)
  }

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    let permissions = this.reflector.get<string[]>('permissions', context.getHandler());
    if (!permissions) {
      return true;
    }
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    const perms = from(user.permission)

    permissions = permissions.map(permission => {
      const level = permission.split(':')
      if (!isNil(level[2])) {
        return permission.replace(level[2], request.params[level[2]])
      }
      return permission
    })

    this.myLogger.debug(`permissions on route: ${permissions}`)
    this.myLogger.debug(`user permissions: ${user.permission}`)

    if (!perms.checkAny(permissions)) {
      throw new UnauthorizedException()
    }

    return true
  }
}

export const Permissions = (...permissions: string[]) => SetMetadata('permissions', permissions);
