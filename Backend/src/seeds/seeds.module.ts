import { Module } from '@nestjs/common';
import { CommentModule } from '../comment/comment.module';
import { RequestsModule } from '../requests/requests.module';
import { UserModule } from '../user/user.module';
import { Seeder } from './seeder';

@Module({
  imports: [UserModule, RequestsModule, CommentModule],
  providers: [Seeder]
})
export class SeedsModule {}
