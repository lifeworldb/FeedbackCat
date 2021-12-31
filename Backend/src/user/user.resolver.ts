import { Args, ID, Mutation, Query, Resolver } from '@nestjs/graphql';
import { ObjectId } from 'mongodb';
import { NotFoundException, UseGuards } from '@nestjs/common';
import { Public } from '../auth/metadatas/auth.metadata';
import { User } from './models/user.model';
import { UserService } from './user.service';
import { AllArgs } from '../common/args/general.args';
import { PoliciesGuard } from '../casl/guards/policies.guard';
import { CheckPolicies } from '../casl/decorators/casl.decorator';
// eslint-disable-next-line import/namespace,import/named
import { AppAbility } from '../casl/casl-ability.factory';
import { Actions } from '../casl/dto/casl.enums';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@Resolver(() => User)
export class UserResolver {
  constructor(private readonly service: UserService) {}

  @Query(() => User, {
    name: 'me'
  })
  async getProfile(@CurrentUser() user: User): Promise<User> {
    return user;
  }

  // @UseGuards(PoliciesGuard)
  // @CheckPolicies((ability: AppAbility) => ability.can(Actions.Read, User))
  @Query(() => User)
  async user(@Args('id', { type: () => ID }) id: ObjectId): Promise<User> {
    const user = await this.service.get(id);
    console.log(user.access);
    if (!user) {
      throw new NotFoundException(`A User with the indicated ID has not been found: ${id}`);
    }
    return user;
  }

  @Public()
  @Query(() => [User])
  async users(@Args() usersArgs: AllArgs): Promise<User[]> {
    return this.service.all(usersArgs);
  }
}
