import {gql} from "@apollo/client";


  ///處理搜尋
  export const SEARCH_USERS_QUERY = gql`
    query SearchUsers($searchTerm: String!) {
      searchUsers(searchTerm: $searchTerm) {
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
  export const getQuery = gql`
  query {
    userdata {
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
`

export const getFavorite = gql`
query Query($token: String!) {
  getFavorites(token: $token) {
    dataId
  }
}
`