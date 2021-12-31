import { Field, ID, InterfaceType } from '@nestjs/graphql';
import { ObjectId } from 'mongodb';

@InterfaceType({
  description: 'Basic structure of all available objects.'
})
export abstract class Node {
  @Field(() => ID, {
    name: 'id',
    nullable: true,
    description: 'Unique identification string of a record.'
  })
  _id: ObjectId;

  @Field({
    nullable: true,
    description: 'Record creation date.'
  })
  createdAt: Date;

  @Field({
    nullable: true,
    description: 'Date of the last updated of the record.'
  })
  updatedAt: Date;
}
