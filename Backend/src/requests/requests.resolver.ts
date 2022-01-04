import { Resolver } from '@nestjs/graphql';
import { RequestsService } from './requests.service';

@Resolver()
export class RequestsResolver {
  constructor(private readonly requestsService: RequestsService) {}
}
