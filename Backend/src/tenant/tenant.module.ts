import { Module } from '@nestjs/common';
import { TypegooseModule } from 'nestjs-typegoose';
import { TenantService } from './tenant.service';
import { TenantResolver } from './tenant.resolver';
import { Tenant } from './models/tenant.model';
import { Establishment } from './models/establishment.model';

@Module({
  imports: [TypegooseModule.forFeature([Tenant, Establishment])],
  providers: [TenantResolver, TenantService],
  exports: [TenantService]
})
export class TenantModule {}
