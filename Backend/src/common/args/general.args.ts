import { ArgsType, Field, ID, Int } from '@nestjs/graphql';
import { Max, Min } from 'class-validator';
import mongoose from 'mongoose';

@ArgsType()
export class AllArgs {
  @Field(() => Int, {
    description: 'Enter how many elements you want to skip in the query.'
  })
  @Min(0)
  skip = 0;

  @Field(() => Int, {
    description: 'Indicates how many elements you want to take from the query.'
  })
  @Min(0)
  @Max(15)
  take = 0;
}

@ArgsType()
export class IdArgs {
  @Field(() => ID, {
    description: 'Indicate the ID for which you want to consult.'
  })
  id: mongoose.Types.ObjectId;
}

@ArgsType()
export class TokenArgs {
  @Field({
    nullable: true,
    description: 'Definition of the token required by the query.'
  })
  token: string;
}
