import { AuthQueries, AuthVariables } from './queries/auth';
import { UserQueries, UserVariables } from './queries/user';
import { TenantQueries, TenantVariables } from './queries/tenant';

const TabsQueries = [
  {
    name: 'Authentication Queries',
    endpoint: '/graphql',
    query: AuthQueries,
    variables: AuthVariables
  },
  {
    name: 'User Queries',
    endpoint: '/graphql',
    query: UserQueries,
    variables: UserVariables
  },
  {
    name: 'Tenant Queries',
    endpoint: '/graphql',
    query: TenantQueries,
    variables: TenantVariables
  }
];

export default TabsQueries;
