import { Field, Int, ObjectType } from '@nestjs/graphql';
import { modelOptions, pre, prop, Ref, Severity } from '@typegoose/typegoose';
import moment from 'moment-timezone';
import { ObjectId } from 'mongodb';

import { Node } from '../../common/interfaces/node.interface';
import { Status } from '../dto/request.enums';
import { Comment } from '../../comment/models/comment.model';

@pre<Request>('save', function (next) {
  this['createdAt'] = moment().tz(process.env.DATE_TIMEZONE).toDate();
  this['updatedAt'] = moment().tz(process.env.DATE_TIMEZONE).toDate();
  next();
})
@pre<Request>('findOneAndUpdate', function () {
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
export class Request implements Node {
  _id: ObjectId;
  
  @Field()
  @prop()
  title: string;

  @Field()
  @prop()
  category: string;

  @Field(() => Int)
  @prop({ default: 0 })
  upVotes: number;

  @Field(() => Status)
  @prop({ enum: Status })
  status: Status;

  @Field()
  @prop()
  description: string;

  @Field(() => Comment, { nullable: true })
  @prop({ ref: () => Comment })
  comments?: Ref<Comment>[];

  @prop()
  createdAt: Date;

  @prop()
  updatedAt: Date;

  constructor(partial: Partial<Request>) {
    Object.assign(this, partial);
  }
}