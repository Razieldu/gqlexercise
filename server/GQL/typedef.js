const { gql } = require("apollo-server-express");

const typeDefs = gql`
  type User {
    dataId: String
    id: String
    name: String
    email: String
    workplace: String
    worktitle: String
    address: String
    tel: String
    mobilephone: String
  }

  type LoginUser {
    id: ID!
    username: String!
  }

  type Query {
    hello: String
    userdata: [Data]
    searchUsers(searchTerm: String!): [User]
    users: [LoginUser!]!
    getFavorites(token: String!): [Favorites]
    findTokenToResetPassword(token: String!): Permission
  }

  type Permission {
    permission: Boolean
    email: String
  }

  type Data {
    dataId: String
    id: String
    name: String
    email: String
    workplace: String
    worktitle: String
    address: String
    tel: String
    mobilephone: String
  }

  type Mutation {
    addUser(userInput: UserInput!): String
    deleteUser(id: String!): String
    updateUserData(dataId: String!, UpdateUserInput: UpdateUserInput!): User
    register(
      username: String!
      password: String!
      displayname: String!
    ): AuthPayload!
    login(username: String!, password: String!): AuthPayload!
    handleFavorite(token: String!, dataId: String!): [Favorites]
    sendPasswordResetEmail(email: String!): ResetPasswordReturn
  }

  input UserInput {
    id: String!
    name: String!
    email: String!
    workplace: String!
    worktitle: String!
    address: String!
    tel: String!
    mobilephone: String!
  }

  input UpdateUserInput {
    id: String
    dataId: String
    name: String
    email: String
    workplace: String
    worktitle: String
    address: String
    tel: String
    mobilephone: String
  }

  type AuthPayload {
    userData: UserData
    message: Message
  }

  type UserData {
    token: String
    username: String
    displayname: String
    favoritesItems: [Favorites]
  }

  type Message {
    message: String
  }

  type Favorites {
    dataId: String
  }

  type ResetPasswordReturn {
    status: String
    message: Message
  }
`;

module.exports = {
  typeDefs,
};
