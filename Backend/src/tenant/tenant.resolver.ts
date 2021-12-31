import { Args, ID, Query, Resolver } from '@nestjs/graphql';
import { ObjectId } from 'mongodb';
import { TenantService } from './tenant.service';
import { Tenant } from './models/tenant.model';
import { AllArgs } from '../common/args/general.args';
import { Public } from '../auth/metadatas/auth.metadata';

@Resolver()
export class TenantResolver {
  constructor(private readonly tenantService: TenantService) {}

  @Public()
  @Query(() => Tenant)
  async tenant(@Args('id', { type: () => ID }) id: ObjectId): Promise<Tenant> {
    return this.tenantService.get(id);
  }

  @Public()
  @Query(() => [Tenant])
  async tenants(@Args() tenantsArgs: AllArgs): Promise<Tenant[]> {
    return this.tenantService.all(tenantsArgs);
  }
}
