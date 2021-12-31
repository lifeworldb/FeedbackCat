import { ExecutionContext, Inject, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GqlExecutionContext } from '@nestjs/graphql';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { IS_PUBLIC_KEY } from '../metadatas/auth.metadata';
import { UserService } from '../../user/user.service';

@Injectable()
export class GqlAuthGuard extends AuthGuard('jwt') {
  private errorName = null;

  constructor(
    @Inject(UserService)
    private readonly userService: UserService,
    private readonly reflector: Reflector
  ) {
    super();
  }

  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass()
    ]);

    if (isPublic) return true;

    return super.canActivate(context);
  }

  getRequest(context: ExecutionContext): any {
    const ctx = GqlExecutionContext.create(context).getContext();
    this.errorName = ctx.errorName;

    return ctx.req;
  }

  handleRequest(err, user) {
    if (err || !user) throw err || new Error(this.errorName.UNAUTHORIZED);

    return user;
  }
}
