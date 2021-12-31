import { ArgsType, Field } from '@nestjs/graphql';
import { AuthInput } from './auth.inputs';

@ArgsType()
export class AuthArgs {
  @Field(() => AuthInput, {
    description: 'Access data required for the creation of the token.'
  })
  input: AuthInput;
}
