import { Field, ObjectType } from '@nestjs/graphql';
import { modelOptions, pre, prop, Ref, Severity } from '@typegoose/typegoose';
import { ObjectId } from 'mongodb';
import moment from 'moment-timezone';
import { User } from '../../user/models/user.model';

import { Node } from '../../common/interfaces/node.interface';

@pre<Reply>('save', function (next) {
  this['createdAt'] = moment().tz(process.env.DATE_TIMEZONE).toDate();
  this['updatedAt'] = moment().tz(process.env.DATE_TIMEZONE).toDate();
  next();
})
@pre<Reply>('findOneAndUpdate', function () {
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
export class Reply implements Node {
  _id: ObjectId;

  @Field()
  @prop()
  content: string;

  @Field()
  @prop()
  replyingTo: string;

  @Field(() => User)
  @prop({ ref: () => User })
  user: Ref<User>;

  @prop()
  createdAt: Date;

  @prop()
  updatedAt: Date;

  constructor(data: Partial<Reply>) {
    Object.assign(this, data);
  }
}
