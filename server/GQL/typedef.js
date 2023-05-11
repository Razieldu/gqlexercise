const { gql } = require("apollo-server-express");


const typeDefs = gql`
type Query {
  hello: String
  userdata: [Data]
  searchUsers(searchTerm: String!): [User]
}

type Data {
  dataId:String
  id: String
  name: String
  email: String
  workplace: String
  worktitle: String
  address: String
  tel: String
  mobilephone: String
}

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

type Mutation {
  addUser(userInput: UserInput!): String
  deleteUser(id: String!): String
  updateUserData(dataId:String!,UpdateUserInput: UpdateUserInput!):User
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
  dataId:String
  name: String
  email: String
  workplace: String
  worktitle: String
  address: String
  tel: String
  mobilephone: String
}
`

module.exports={
 typeDefs
}