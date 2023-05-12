import React, { useState } from "react";
import { SEARCH_USERS_QUERY } from "../GQL/query/query"
import { UPDATE_USER_MUTATION } from "../GQL/mutation/mutations";
import { useMutation } from "@apollo/client";
import client from "../apollo.js";
export const handleSearchDataContext = React.createContext();

export const SearchDataHandlerContextProvider = (props) => {
  const [searchData, setSearchData] = useState([]);

  async function searchUsers(searchTerm) {
    try {
      const { data } = await client.query({
        query: SEARCH_USERS_QUERY,
        variables: { searchTerm },
      });
      setSearchData(data.searchUsers);
    } catch (error) {
      console.error(error);
    }
  }
  const [updateUserMutation] = useMutation(UPDATE_USER_MUTATION, {
    onCompleted: (data) => {
      // console.log(data);
      console.log("成功更新資料"); // 成功回應資料
    },
  });
  const updateDatabase = async (object, id) => {
    updateUserMutation({
      variables: {
        updateUserInput: object,
        dataId: id,
      },
    })
      .then((result) => console.log(result))
      .catch((error) => console.error(error));
  };



  let contextValue = {
    searchDataValue: searchData,
    setSearchDataValue: setSearchData,
    searchUsersFn: searchUsers,
    updateDateBaseFn: updateDatabase,
  };

  return (
    <handleSearchDataContext.Provider value={contextValue}>
      {props.children}
    </handleSearchDataContext.Provider>
  );
};
