import { Field, InputType } from '@nestjs/graphql';
import { IsEmail, IsNotEmpty } from 'class-validator';

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
  firstName: string;

  @IsNotEmpty()
  @Field({
    description: 'Surname of the person who owns the account.'
  })
  lastName: string;

  @IsNotEmpty()
  @IsEmail()
  @Field({
    description: 'Email account that will be associated with the account.'
  })
  email: string;

  @IsNotEmpty()
  @Field({
    description: 'Password for the login that will be associated with the account.'
  })
  password: string;

  @IsNotEmpty()
  @Field({
    description: 'Telephone number of the person who will be associated with the account.'
  })
  phoneNumber: string;
}
