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
mutation Mutation($username: String!, $password: String!) {
  register(username: $username, password: $password) {
    userData {
      token
      userName
      displayName
      favoritesItems {
        dataId
      }
    }
    message {
      message
    }
  }
}
`;

export const LOGIN_USER = gql`
mutation Login($username: String!, $password: String!) {
  login(username: $username, password: $password) {
    userData {
      token
      userName
      displayName
      favoritesItems {
        dataId
      }
    }
    message {
      message
    }
  }
}
`;

export const HANDLE_FAVORITE = gql`
mutation Mutation($token: String!, $dataId: String!) {
  handleFavorite(token: $token, dataId: $dataId) {
    dataId
  }
}
`;


