export const AuthQueries = `
# Auth Queries

# Authenticate user
mutation Login($input: AuthInput!) {
  login(input: $input) {
    developerCode
    message
  }
}

# Refresh authentication token
mutation RefreshToken {
  refreshToken {
    message
    developerCode
  }
}
`;

const Variables = {
  input: {
    password: 'serbyAdmin123',
    phoneNumber: '+579999999999'
  }
};

export const AuthVariables = JSON.stringify(Variables);
