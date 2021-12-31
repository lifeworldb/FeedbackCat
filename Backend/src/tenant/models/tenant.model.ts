import { Field, ObjectType } from '@nestjs/graphql';
import { modelOptions, pre, prop, Ref, Severity } from '@typegoose/typegoose';
import moment from 'moment-timezone';
import { ObjectId } from 'mongodb';

import { Node } from '../../common/interfaces/node.interface';
import { Address } from '../../common/types/address.type';

@pre<Tenant>('save', function (next) {
  this['createdAt'] = moment().tz(process.env.DATE_TIMEZONE).toDate();
  this['updatedAt'] = moment().tz(process.env.DATE_TIMEZONE).toDate();
  next();
})
@pre<Tenant>('findOneAndUpdate', function () {
  this['_update'].updatedAt = moment().tz(process.env.DATE_TIMEZONE).toDate();
})
@ObjectType({
  implements: [Node],
  description: 'Definition of tenant data within the Serby system.'
})
@modelOptions({ options: { allowMixed: Severity.ALLOW } })
export class Tenant implements Node {
  _id: ObjectId;

  @Field()
  code: string;

  @Field()
  chamberAffiliated: string;

  @Field()
  name: string;

  @Field()
  taxId: string;

  @Field()
  phoneNumber: string;

  @Field()
  email: string;

  @Field()
  description: string;

  @Field()
  urlWebsite: string;

  @Field()
  fundationDate: Date;

  @Field()
  businessHours: string;

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

  constructor(partial: Partial<Tenant>) {
    Object.assign(this, partial);
  }
}
