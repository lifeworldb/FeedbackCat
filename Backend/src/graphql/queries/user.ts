export const UserQueries = `
# Users Queries

#Get a user by Auth Toke
query Me {
  me {
    id
    userName
  }
}

# Get a user by id
query User($userId: ID!) {
  user(id: $userId) {
    id
    userName
  }
}

# Get all users
query Users($skip: Int, $take: Int) {
  users(skip: $skip, take: $take) {
    id
    userName
    firstName
    lastName
    email
  }
}
`;

const Variables = {
  userId: '',
  skip: 0,
  take: 0
};

export const UserVariables = JSON.stringify(Variables);
