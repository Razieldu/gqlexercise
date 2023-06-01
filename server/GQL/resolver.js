const {
  getUsers,
  searchUser,
  addUser,
  deleteUser,
  updateUser,
  registerUser,
  loginUser,
  handleFavorite,
  getFavorites,
  resetPassword,
} = require("../methods/method");

const resolvers = {
  Query: {
    userdata: async () => {
      try {
        const users = await getUsers("usersData", "Data");
        let result = users.map((user) => ({
          ...user,
          dataId: user._id.toString(),
        }));
        return result;
      } catch (error) {
        console.error(error);
        throw error;
      }
    },
    searchUsers: async (_, { searchTerm }, context) => {
      // if (context.user!=="s202032808@gmail.com") {
      //     throw new Error("您非網站管理者,請洽詢管理員")
      // }
      try {
        const users = await searchUser(searchTerm, "usersData", "Data");
        return users.map((user) => ({ ...user, dataId: user._id.toString() }));
      } catch (error) {
        console.error(error);
        throw error;
      }
    },
    getFavorites: async (_, { token }) => {
      try {
        const userFavoriteData = await getFavorites(
          token,
          "userAccountData",
          "userNamePasswordData"
        );
        return userFavoriteData;
      } catch (error) {
        console.error(error);
      }
    },
  },
  Mutation: {
    addUser: (_, args, { user }) => {
      if (user !== "ADMIN") {
        throw new Error("您非網站管理者,請洽詢管理員");
      }
      addUser(args.userInput, "usersData", "Data");
    },
    deleteUser: (_, { id }, { user }) => {
      if (user !== "ADMIN") {
        throw new Error("您非網站管理者,請洽詢管理員");
      }
      deleteUser(id, "usersData", "Data");
    },
    updateUserData: async (_, { dataId, UpdateUserInput }, { user }) => {
      console.log(UpdateUserInput);
      if (user !== "ADMIN") {
        throw new Error("您非網站管理者,請洽詢管理員");
      }
      console.log(dataId);
      for (let key in UpdateUserInput) {
        if (UpdateUserInput[key] === "") delete UpdateUserInput[key];
      }
      const updateObj = { ...UpdateUserInput };
      console.log(updateObj);
      // delete updateObj.id; // 移除 id 屬性，因為我們使用 dataId 屬性作為查找條件
      try {
        await updateUser(dataId, "usersData", "Data", updateObj);
        return true;
      } catch (error) {
        console.error(error);
        return false;
      }
    },
    register: async (_, { username, password, displayname }) => {
      let data = { username, password, displayname };
      try {
        const token = await registerUser(
          data,
          "userAccountData",
          "userNamePasswordData"
        );
        // console.log(token);
        return token;
      } catch (error) {
        console.error(error);
      }
    },
    login: async (_, { username, password }) => {
      let data = { username, password };
      try {
        const response = await loginUser(
          data,
          "userAccountData",
          "userNamePasswordData"
        );
        console.log(response);
        return response;
      } catch (error) {
        console.error(error);
      }
    },
    handleFavorite: async (_, { token, dataId }) => {
      try {
        const favoritesItems = await handleFavorite(
          token,
          dataId,
          "userAccountData",
          "userNamePasswordData"
        );
        console.count();
        console.log(favoritesItems);
        return favoritesItems;
      } catch (error) {
        console.error(error);
      }
    },
    sendPasswordResetEmail: async (_, { email }) => {
      const data = await resetPassword(
        email,
        "userAccountData",
        "userNamePasswordData"
      );
      return data
      
    },
  },
};

module.exports = {
  resolvers,
};
