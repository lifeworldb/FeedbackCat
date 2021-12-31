import { Field, ObjectType } from '@nestjs/graphql';
import { modelOptions, pre, prop, Ref, Severity } from '@typegoose/typegoose';
import { IsEnum, IsEmail, IsBoolean } from 'class-validator';
import moment from 'moment-timezone';
import { ObjectId } from 'mongodb';

import { Node } from '../../common/interfaces/node.interface';

@pre<User>('save', function (next) {
  this['createdAt'] = moment().tz(process.env.DATE_TIMEZONE).toDate();
  this['updatedAt'] = moment().tz(process.env.DATE_TIMEZONE).toDate();
  next();
})
@pre<User>('findOneAndUpdate', function () {
  this['_update'].updatedAt = moment().tz(process.env.DATE_TIMEZONE).toDate();
})
@ObjectType({
  implements: () => [Node],
  description: 'Definition of user data within the Serby system.'
})
@modelOptions({
  schemaOptions: {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  },
  options: { allowMixed: Severity.ALLOW }
})
export class User implements Node {
  _id: ObjectId;

  @Field()
  @prop()
  userName: string;

  @Field()
  @prop()
  name: string;

  @Field()
  @prop()
  image: string;

  @prop()
  createdAt: Date;

  @prop()
  updatedAt: Date;

  constructor(partial: Partial<User>) {
    Object.assign(this, partial);
  }
}
