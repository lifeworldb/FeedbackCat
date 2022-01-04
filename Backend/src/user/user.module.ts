import { Module } from '@nestjs/common';
import { TypegooseModule } from 'nestjs-typegoose';
import { User } from './models/user.model';
import { UserService } from './user.service';
import { UserResolver } from './user.resolver';

@Module({
  imports: [TypegooseModule.forFeature([User])],
  providers: [UserResolver, UserService],
  exports: [UserService]
})
export class UserModule {}
