export const TenantQueries = `
# Tenants Queries

# Get a tenant by id
query Tenant($tenantId: ID!) {
  tenant(id: $tenantId) {
    id
    name
    description
    email
  }
}

# Get all tenants
query Tenants($skip: Int, $take: Int) {
  tenants(skip: $skip, take: $take) {
    id
    name
    description
    email
  }
}
`;

const Variables = {
  tenantId: '',
  skip: 0,
  take: 0
};

export const TenantVariables = JSON.stringify(Variables);
