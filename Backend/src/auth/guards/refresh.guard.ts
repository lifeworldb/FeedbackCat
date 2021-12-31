import { Injectable, ExecutionContext } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GqlExecutionContext } from '@nestjs/graphql';

@Injectable()
export class RefreshAuthGuard extends AuthGuard('jwt-refresh') {
  getRequest(context: ExecutionContext): any {
    return GqlExecutionContext.create(context).getContext().req;
  }
}
