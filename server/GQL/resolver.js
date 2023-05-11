const {
  getUsers,
  searchUser,
  addUser,
  deleteUser,
  updateUser,
} = require("../methods/method");

const resolvers = {
  Query: {
    hello: () => "Hello World!",
    userdata: async () => {
      try {
        const users = await getUsers("usersData", "Data");
        let result = users.map((user) => ({
          ...user,
          dataId: user._id.toString(),
        }));
        // testData(result)
        return result;
      } catch (error) {
        console.error(error);
        throw error;
      }
    },
    searchUsers: async (_, { searchTerm }) => {
      try {
        const users = await searchUser(searchTerm, "usersData", "Data");
        return users.map((user) => ({ ...user, dataId: user._id.toString() }));
      } catch (error) {
        console.error(error);
        throw error;
      }
    },
    // () => {
    //   //本地端拿資料
    //   const rawData = fs.readFileSync(path.join(__dirname, 'data.json'));
    //   const data = JSON.parse(rawData);
    //   return data;
    // }
  },
  Mutation: {
    addUser: (_, args) => addUser(args.userInput, "usersData", "Data"),
    deleteUser: (_, { id }) => deleteUser(id, "usersData", "Data"),
    updateUserData: async (_, { dataId, UpdateUserInput }) => {
      console.log(UpdateUserInput)
      console.log(dataId)
      for(let key in UpdateUserInput){
          if(UpdateUserInput[key]==="") delete UpdateUserInput[key]
      }
      const updateObj = { ...UpdateUserInput };
      console.log(updateObj)
      // delete updateObj.id; // 移除 id 屬性，因為我們使用 dataId 屬性作為查找條件
      try {
        await updateUser(dataId, "usersData", "Data", updateObj);
        return true;
      } catch (error) {
        console.error(error);
        return false;
      }
    },
  },
};

module.exports = {
  resolvers,
};
