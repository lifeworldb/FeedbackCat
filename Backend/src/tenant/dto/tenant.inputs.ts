import { Field, InputType } from '@nestjs/graphql';

@InputType({
  description: 'Required fields to create an tenant within the Serby platform.'
})
export class TenantCreateFields {}
