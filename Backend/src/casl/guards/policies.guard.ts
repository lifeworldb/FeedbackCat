import { Reflector } from '@nestjs/core';
import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
// eslint-disable-next-line import/namespace,import/named
import { AppAbility, CaslAbilityFactory } from '../casl-ability.factory';
import { CHECK_POLICIES_KEY, PolicyHandler } from '../decorators/casl.decorator';
import { GqlExecutionContext } from '@nestjs/graphql';

@Injectable()
export class PoliciesGuard implements CanActivate {
  constructor(private reflector: Reflector, private caslAbilityFactory: CaslAbilityFactory) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const policyHandlers =
      this.reflector.get<PolicyHandler[]>(CHECK_POLICIES_KEY, context.getHandler()) || [];

    const { user } = GqlExecutionContext.create(context).getContext().req;
    const ability = this.caslAbilityFactory.createAbility(user);

    const result = policyHandlers.every((handler) =>
      PoliciesGuard.execPolicyHandler(handler, ability)
    );
    if (!result) {
      throw new UnauthorizedException('No authorization to perform this action');
    } else {
      return result;
    }
  }

  private static execPolicyHandler(handler: PolicyHandler, ability: AppAbility) {
    if (typeof handler === 'function') {
      return handler(ability);
    }
    return handler.handle(ability);
  }
}
