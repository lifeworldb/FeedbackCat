import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PinoLogger } from 'nestjs-pino';
import { InjectModel } from 'nestjs-typegoose';
import { ReturnModelType } from '@typegoose/typegoose';
import { ObjectId } from 'mongodb';

import { Response } from '../common/interfaces/response.interface';
import { AllArgs } from '../common/args/general.args';
import { DeveloperResponse } from '../common/enums';
import { ITenantService } from './dto/tenant.interface';
import { Tenant } from './models/tenant.model';
import { TenantCreateFields } from './dto/tenant.inputs';

@Injectable()
export class TenantService implements ITenantService {
  constructor(
    @InjectModel(Tenant)
    private readonly model: ReturnModelType<typeof Tenant>,
    private readonly config: ConfigService,
    private readonly logger: PinoLogger
  ) {
    logger.setContext(TenantService.name);
  }

  /**
   * Responsible method of searching and returning all existing tenants in the database, in their entirety or with a designated limit.
   * @param {number} skip
   * @param {number} take
   * @returns
   */
  async all({ skip, take }: AllArgs = { skip: 0, take: 0 }): Promise<Tenant[]> {
    return await this.model.find().skip(skip).limit(take).exec();
  }

  /**
   * Responsible method of searching and returning a tenant based solely on their ID.
   * @param {ObjectId} id Corresponds to the ID of the tenant to be consulted.
   * @returns {Promise<Tenant>} Returns a promise with the found tenant.
   */
  async get(id: ObjectId): Promise<Tenant> {
    return this.model.findById(new ObjectId(id));
  }

  create(data: TenantCreateFields): Promise<Response> {
    return Promise.resolve(undefined);
  }
}
