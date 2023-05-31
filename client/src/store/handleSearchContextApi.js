import React, { useState } from "react";
import { SEARCH_USERS_QUERY, getFavorite } from "../GQL/query/query";
import { UPDATE_USER_MUTATION } from "../GQL/mutation/mutations";
import { useMutation } from "@apollo/client";
import client from "../GQL/apollo";
export const handleSearchDataContext = React.createContext();

export const SearchDataHandlerContextProvider = (props) => {
  const [searchData, setSearchData] = useState([]);
   
  async function searchUsers(searchTerm) {
    try {
      let token = JSON.parse(localStorage.getItem("userData"))?.token;
      // console.log(token)
      const { data } = await client.query({
        query: SEARCH_USERS_QUERY,
        variables: { searchTerm },
      });
      const { data: favoriteData } = await client.query({
        query: getFavorite,
        variables: { token },
      });

      let { getFavorites } = favoriteData;
      let idFavorite =
        getFavorites.length > 0 ? getFavorites.map((one) => one.dataId) : [];
      let addFavoriteData = data.searchUsers.map((eachUserObject) => {
        if (idFavorite.includes(eachUserObject.dataId)) {
          return { ...eachUserObject, favorite: true };
        } else {
          return { ...eachUserObject, favorite: false };
        }
      });
      setSearchData(addFavoriteData);
      // console.log(searchData)
    } catch (error) {
      console.error(error.message);
      alert(error.message);
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
      .catch((error) => {
        console.error(error.message);
        alert(error.message);
      });
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
