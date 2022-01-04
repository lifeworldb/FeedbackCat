import { registerEnumType } from '@nestjs/graphql';

export enum DeveloperResponse {
  SUCCESS_QUERY,
  ERROR_QUERY,
  INTERNAL_ERROR,
  USER_ALREADY_EXISTING,
}

registerEnumType(DeveloperResponse, {
  name: 'DeveloperCode'
});
