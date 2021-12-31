import { Field, ObjectType, Int } from '@nestjs/graphql';
import { Type, Injectable } from '@nestjs/common';
import { compare } from 'bcrypt';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const FormatError = require('easygraphql-format-error');

export function Paginated<T>(classRef: Type<T>): any {
  @ObjectType(`${classRef.name}Edge`)
  abstract class EdgeType {
    @Field(() => String)
    cursor: string;

    @Field(() => classRef)
    node: T;
  }

  @ObjectType({ isAbstract: true })
  abstract class PaginatedType {
    @Field(() => [EdgeType], { nullable: true })
    edges: EdgeType[];

    @Field(() => [classRef], { nullable: true })
    nodes: T[];

    @Field(() => Int)
    totalCount: number;

    @Field()
    hasNextPage: boolean;
  }

  return PaginatedType;
}

@Injectable()
export class PasswordUtils {
  async compare(password: string, hash: string): Promise<boolean> {
    return Promise.resolve(compare(password, hash));
  }
}

export const formatError = new FormatError([]);

export const errorName = formatError.errorName;
