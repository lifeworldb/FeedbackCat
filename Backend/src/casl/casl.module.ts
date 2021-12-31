import { Module } from '@nestjs/common';
// eslint-disable-next-line import/namespace,import/named
import { CaslAbilityFactory } from './casl-ability.factory';

@Module({
  providers: [CaslAbilityFactory],
  exports: [CaslAbilityFactory]
})
export class CaslModule {}
