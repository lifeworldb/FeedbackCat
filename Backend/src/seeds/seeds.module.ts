import { Module } from '@nestjs/common';
import { UserModule } from '../user/user.module';
import { Seeder } from './seeder';

@Module({
  imports: [UserModule],
  providers: [Seeder]
})
export class SeedsModule {}
