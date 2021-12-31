import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class AuthInput {
  @Field({
    nullable: true,
    description: 'Email of the user with which the session will be created.'
  })
  email: string;

  @Field({
    nullable: true,
    description: 'Cell phone number of the user with which you want to start a session.'
  })
  phoneNumber: string;

  @Field({
    nullable: true,
    description: 'Password of the user with whom you want to log in.'
  })
  password: string;
}
