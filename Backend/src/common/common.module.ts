import { Module } from '@nestjs/common';
import { PasswordUtils } from './functions';

@Module({
  providers: [PasswordUtils],
  exports: [PasswordUtils]
})
export class CommonModule {}
