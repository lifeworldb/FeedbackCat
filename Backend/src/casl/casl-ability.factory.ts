import { Injectable } from '@nestjs/common';
import {
  Ability,
  AbilityBuilder,
  AbilityClass,
  ExtractSubjectType,
  InferSubjects
} from '@casl/ability';
import { Tenant } from '../tenant/models/tenant.model';
import { User } from '../user/models/user.model';
import { Actions } from './dto/casl.enums';

type Subjects = InferSubjects<typeof Tenant | typeof User> | 'all';

export type AppAbility = Ability<[Actions, Subjects]>;

@Injectable()
export class CaslAbilityFactory {
  createAbility(user: User): any {
    const { can, cannot, build } = new AbilityBuilder<Ability<[Actions, Subjects]>>(
      Ability as AbilityClass<AppAbility>
    );

    cannot(Actions.Read, User);

    return build({
      detectSubjectType: (item) => item.constructor as ExtractSubjectType<Subjects>
    });
  }
}
