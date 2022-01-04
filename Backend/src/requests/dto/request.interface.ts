import { ObjectId } from 'mongodb';
import { Response } from '../../common/interfaces/response.interface';
import { AllArgs } from '../../common/args/general.args';
import { Request } from '../models/request.model';
import { RequestCreateFields } from './request.inputs';

export interface IRequestService {
  create(data: RequestCreateFields): Promise<Response>;
  get(id: ObjectId): Promise<Request>;
  all(data: AllArgs): Promise<Request[]>;
}
