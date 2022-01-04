import { Args, ID, Mutation, Query, Resolver } from '@nestjs/graphql';
import { ObjectId } from 'mongodb';
import { NotFoundException, UseGuards } from '@nestjs/common';
import { User } from './models/user.model';
import { UserService } from './user.service';
import { AllArgs } from '../common/args/general.args';

@Resolver(() => User)
export class UserResolver {
  constructor(private readonly service: UserService) {}


  @Query(() => User)
  async user(@Args('id', { type: () => ID }) id: ObjectId): Promise<User> {
    const user = await this.service.get(id);
    if (!user) {
      throw new NotFoundException(`A User with the indicated ID has not been found: ${id}`);
    }
    return user;
  }

  @Query(() => [User])
  async users(@Args() usersArgs: AllArgs): Promise<User[]> {
    return this.service.all(usersArgs);
  }
}
