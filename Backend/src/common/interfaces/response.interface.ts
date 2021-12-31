import { Field, ObjectType } from '@nestjs/graphql';
import { IsEnum } from 'class-validator';
import { DeveloperResponse } from '../enums';

@ObjectType('Response', {
  description: 'Basic structure of the response message to a request.'
})
export class Response {
  @Field({
    description: 'Message body of the response of a query.'
  })
  message: string;

  @IsEnum(DeveloperResponse)
  @Field(() => DeveloperResponse, {
    description: 'Enumerable that identifies the type of result, for use by a developer.'
  })
  developerCode: DeveloperResponse;

  constructor(partial: Partial<Response>) {
    Object.assign(this, partial);
  }
}
