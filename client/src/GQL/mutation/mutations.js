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
  mutation Mutation(
    $username: String!
    $password: String!
    $displayname: String!
  ) {
    register(
      username: $username
      password: $password
      displayname: $displayname
    ) {
      userData {
        token
        username
        displayname
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
        username
        displayname
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

export const RESET_PASSWORD = gql`
  mutation SendEmailResetPassword($email: String!) {
    sendEmailResetPassword(email: $email) {
      status
      message {
        message
      }
    }
  }
`;

export const UPDATEPASSWORD_AND_SIGNIN = gql`
mutation Mutation($password: String!, $email: String!) {
  updateUserPassword(password: $password, email: $email) {
    message {
      message
    }
    userData {
      username
      token
      favoritesItems {
        dataId
      }
      displayname
    }
  }
}

`