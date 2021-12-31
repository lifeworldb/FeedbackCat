import { Module } from '@nestjs/common';
import { TypegooseModule } from 'nestjs-typegoose';
import { DateScalar } from '../common/scalars/date.scalar';
import { User } from './models/user.model';
import { DocumentType } from './models/documentType.model';
import { UserService } from './user.service';
import { UserResolver } from './user.resolver';
import { CaslModule } from '../casl/casl.module';
import { Role } from './models/roles.model';
import { Permission } from './models/permissions.model';

@Module({
  imports: [TypegooseModule.forFeature([User, DocumentType, Role, Permission]), CaslModule],
  providers: [UserResolver, UserService],
  exports: [UserService]
})
export class UserModule {}
