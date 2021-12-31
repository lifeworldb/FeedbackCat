import { Field, ObjectType } from '@nestjs/graphql';
import { modelOptions, pre, prop, Ref, Severity } from '@typegoose/typegoose';
import moment from 'moment-timezone';
import { ObjectId } from 'mongodb';

import { Node } from '../../common/interfaces/node.interface';
import { Address } from '../../common/types/address.type';
import { Tenant } from './tenant.model';

@pre<Establishment>('save', function (next) {
  this['createdAt'] = moment().tz(process.env.DATE_TIMEZONE).toDate();
  this['updatedAt'] = moment().tz(process.env.DATE_TIMEZONE).toDate();
  next();
})
@pre<Establishment>('findOneAndUpdate', function () {
  this['_update'].updatedAt = moment().tz(process.env.DATE_TIMEZONE).toDate();
})
@ObjectType({
  implements: [Node],
  description: 'Definition of tenant data within the Serby system.'
})
@modelOptions({ options: { allowMixed: Severity.ALLOW } })
export class Establishment implements Node {
  _id: ObjectId;

  @Field(() => Tenant, {
    description: 'Tenant owner of the commercial establishment.'
  })
  @prop({ ref: () => Tenant, required: true })
  tenant: Ref<Tenant>;

  name: string;

  @Field(() => Address, {
    nullable: true,
    description: 'Registered address of the tenant.'
  })
  @prop({ ref: () => Address })
  address: Ref<Address>;

  @prop()
  createdAt: Date;

  @prop()
  updatedAt: Date;

  constructor(partial: Partial<Establishment>) {
    Object.assign(this, partial);
  }
}
