import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty } from 'class-validator';

@InputType({
  description: 'Required fields to create an account within the Serby platform.'
})
export class UserCreateFields {
  @IsNotEmpty()
  @Field({
    description: 'Username designated for the account to be created.'
  })
  userName: string;

  @IsNotEmpty()
  @Field({
    description: 'Name of the person who owns the account.'
  })
  image: string;

  @IsNotEmpty()
  @Field({
    description: 'Surname of the person who owns the account.'
  })
  name: string;
}
