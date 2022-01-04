import { registerEnumType } from "@nestjs/graphql";

export enum Status {
  SUGGESTION,
  FEATURE,
  PLANNED,
  IN_PROGRESS,
  LIVE
}

registerEnumType(Status, {
  name: 'Status'
});
