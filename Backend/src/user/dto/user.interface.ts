import { ObjectId } from 'mongodb';
import { Response } from '../../common/interfaces/response.interface';
import { User } from '../models/user.model';
import { AllArgs } from '../../common/args/general.args';
import { UserCreateFields } from './user.inputs';

export interface IUserService {
  create(data: UserCreateFields): Promise<Response>;
  get(id: ObjectId): Promise<User>;
  all(data: AllArgs): Promise<User[]>;
}
