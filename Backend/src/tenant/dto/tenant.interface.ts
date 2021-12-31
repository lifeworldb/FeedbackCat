import { ObjectId } from 'mongodb';
import { Response } from '../../common/interfaces/response.interface';
import { AllArgs } from '../../common/args/general.args';
import { Tenant } from '../models/tenant.model';
import { TenantCreateFields } from './tenant.inputs';

export interface ITenantService {
  create(data: TenantCreateFields): Promise<Response>;
  get(id: ObjectId): Promise<Tenant>;
  all(data: AllArgs): Promise<Tenant[]>;
}
