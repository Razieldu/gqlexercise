import {gql} from "@apollo/client";

export const ADD_USER_MUTATION = gql`
mutation addUser($userInput: UserInput!) {
  addUser(userInput: $userInput)
}
`;
export const DELETE_USER_MUTATION = gql`
mutation DeleteUser($deleteUserId: String!) {
  deleteUser(id: $deleteUserId)
}
`;


