import { gql } from "@apollo/client";

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

export const UPDATE_USER_MUTATION = gql`
  mutation UpdateUser($dataId: String!, $updateUserInput: UpdateUserInput!) {
    updateUserData(dataId: $dataId, UpdateUserInput: $updateUserInput) {
      dataId
      id
      name
      email
      workplace
      worktitle
      address
      tel
      mobilephone
    }
  }
`;
export const REGISTER_USER = gql`
  mutation RegisterUser($username: String!, $password: String!) {
    register(username: $username, password: $password) {
      token
    }
  }
`;

export const LOGIN_USER = gql`
  mutation Login($password: String!, $username: String!) {
    login(password: $password, username: $username) {
      token
    }
  }
`;
