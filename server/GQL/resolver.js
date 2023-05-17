const {
  getUsers,
  searchUser,
  addUser,
  deleteUser,
  updateUser,
  registerUser
} = require("../methods/method");

const resolvers = {
  Query: {
    // users: async () => {
    //     const collection = db.collection('userData');
    //     const users = await collection.find().toArray();
    //     return users;
    //   },
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
      console.log(UpdateUserInput);
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
    register: async (_, { username, password }) => {
     let data= {username,password}
     try {
      const token = await registerUser(data, "userAccountData", "userNamePasswordData");
      console.log(token)
      return token ;
     } catch (error) {
       console.error(error);
     }
    },
    // login: async (_, { username, password }) => {
    //   const user = await mongoose.connection
    //     .collection("userData")
    //     .findOne({ username });
    //   if (!user) {
    //     throw new Error("Invalid username or password");
    //   }

    //   const isPasswordValid = await bcrypt.compare(password, user.password);
    //   if (!isPasswordValid) {
    //     throw new Error("Invalid username or password");
    //   }

    //   const token = jwt.sign({ username }, "your-secret-key");

    //   return { token };
    // },
  },
};

module.exports = {
  resolvers,
};
