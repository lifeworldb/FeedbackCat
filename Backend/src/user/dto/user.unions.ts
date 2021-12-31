import { createUnionType } from '@nestjs/graphql';
import { Response } from '../../common/interfaces/response.interface';
import { User } from '../models/user.model';

export const UserResponseUnion = createUnionType({
  name: 'UserResponseUnion',
  types: () => [User, Response]
});
