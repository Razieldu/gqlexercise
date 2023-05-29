require("dotenv").config();
const { MongoClient, ObjectId } = require("mongodb");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const uri = process.env.DB_HOST;

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

////搜尋功能
async function getUsers(databaseName, collectionName) {
  try {
    await client.connect();
    const database = client.db(databaseName);
    const collection = database.collection(collectionName);
    const users = await collection.find({}).toArray(); // 從資料庫中取出所有用戶資料
    // console.log(users);
    return users; // 返回用戶資料
  } catch (error) {
    console.error(error);
  } finally {
    client.close(); // 關閉連線
  }
}

///添加資料到資料庫
async function addUser(userInput, databaseName, collectionName) {
  try {
    await client.connect();
    const database = client.db(databaseName);
    const collection = database.collection(collectionName);
    const result = await collection.insertOne(userInput);
    console.log(
      `User with id ${result.insertedId} has been added to the database.`
    );
  } catch (error) {
    console.error(error);
  } finally {
    client.close();
  }
}

async function searchUser(searchTerm, databaseName, collectionName) {
  // let databaseId;
  try {
    await client.connect();
    const database = client.db(databaseName);
    const collection = database.collection(collectionName);
    let databaseId = null;
    if (searchTerm.match(/^[0-9a-fA-F]{24}$/)) {
      databaseId = new ObjectId(searchTerm);
    }
    // const databaseId = ObjectId.isValid(searchTerm) ? new ObjectId(searchTerm) : null;
    const users = await collection
      .find({
        $or: [
          { _id: databaseId },
          { id: { $regex: searchTerm, $options: "i" } },
          { name: { $regex: searchTerm, $options: "i" } },
          { email: { $regex: searchTerm, $options: "i" } },
          { workplace: { $regex: searchTerm, $options: "i" } },
          { worktitle: { $regex: searchTerm, $options: "i" } },
          { address: { $regex: searchTerm, $options: "i" } },
          { tel: { $regex: searchTerm, $options: "i" } },
          { mobilephone: { $regex: searchTerm, $options: "i" } },
          // { _id: databaseId },
        ],
      })
      .toArray(); // 搜索匹配的用戶資料

    return users; // 返回用戶資料
  } catch (error) {
    console.error(error);
  } finally {
    client.close(); // 關閉連線
  }
}

async function deleteUser(id, databaseName, collectionName) {
  try {
    await client.connect();
    const database = client.db(databaseName);
    const collection = database.collection(collectionName);
    const _id = new ObjectId(id);

    await collection.deleteOne({ _id: _id }); // 刪除指定用戶資料

    console.log(`User with id ${id} was successfully deleted.`); // 在控制台中顯示刪除成功信息
  } catch (error) {
    console.error(error);
  } finally {
    client.close(); // 關閉連線
  }
}

async function updateUser(id, databaseName, collectionName, updateObj) {
  let updateResult;
  try {
    await client.connect();
    const database = client.db(databaseName);
    const collection = database.collection(collectionName);
    const _id = new ObjectId(id);
    updateResult = await collection.updateOne(
      { _id: _id },
      { $set: updateObj }
    );

    console.log(`${updateResult.modifiedCount} document updated.`);
  } catch (error) {
    console.error(error);
  } finally {
    client.close(); // 關閉連線
  }
  return updateResult;
}

///註冊
async function registerUser(userInfo, databaseName, collectionName) {
  try {
    await client.connect();
    const database = client.db(databaseName);
    const collection = database.collection(collectionName);

    // 检查用户名是否已存在
    const existingUser = await collection.findOne({
      username: userInfo.username,
    });
    if (existingUser) {
      console.log("用户名已存在");
      return { userData: null, message: { message: "用戶名已存在" } }; // 如果用户名已存在，停止注册流程并返回 null
    }
    let otherData = {
      displayName: "",
      favoritesItems: [],
    };
    let newUserData = { ...userInfo, ...otherData };
    let { username, password } = newUserData;
    // 对密码进行哈希加密
    const hashedPassword = await bcrypt.hash(password, 10);

    // 替换原始密码为哈希值
    newUserData.password = hashedPassword;

    const result = await collection.insertOne(newUserData);
    console.log(
      `User with id ${result.insertedId} has been added to the database.`
    );

    const userData = {
      token: jwt.sign({ username }, "userLoginKey"),
      userName:username,
      displayName:"",
      favoritesItems:[]
    };
    const message = {
      message: "登入成功",
    };

    // 返回符合 AuthPayload 类型的对象
    return { userData, message };
  } catch (error) {
    console.error(error);
  } finally {
    await client.close();
  }
}
///登入
async function loginUser(userInfo, databaseName, collectionName) {
  try {
    await client.connect();
    const database = client.db(databaseName);
    const collection = database.collection(collectionName);

    const { password, username } = userInfo;
    // 檢查使用者名稱是否存在
    const existingUser = await collection.findOne({ username });
    // console.log(existingUser);
    if (!existingUser) {
      console.log("使用者名稱不存在");
      return { userData: null, message: { message: "使用者名稱不存在" } }; // 使用者名稱不存在，返回 null
    }

    // 對比密碼
    const passwordMatch = await bcrypt.compare(password, existingUser.password);
    if (!passwordMatch) {
      console.log("密碼不正確");
      return { userData: null, message: { message: "密碼不正確" } }; // 密碼不正確，返回 null
    }

    // 生成 JWT Token
    const userData = {
      token: jwt.sign({ username }, "userLoginKey"),
      userName: existingUser.username,
      displayName: existingUser.displayName,
      favoritesItems: existingUser.favoritesItems,
    };
    const message = {
      message: "登入成功",
    };

    // 返回 Token
    return { userData, message };
  } catch (error) {
    console.error(error);
  } finally {
    await client.close();
  }
}

async function handleFavorite(token, dataId, databaseName, collectionName) {
  try {
    await client.connect();
    const database = client.db(databaseName);
    const collection = database.collection(collectionName);
    const decodedToken = jwt.verify(token, "userLoginKey");
    const user = await collection.findOne({ username: decodedToken.username });
    const favoritesItems = user.favoritesItems || [];
    const existingItemIndex = favoritesItems.findIndex(
      (item) => item.dataId === dataId
    );

    if (existingItemIndex !== -1) {
      // 物件已存在於收藏清單中，表示要取消收藏
      favoritesItems.splice(existingItemIndex, 1);
    } else {
      // 物件不存在於收藏清單中，表示要加入收藏
      favoritesItems.push({ dataId });
    }

    // 更新使用者的收藏清單
    await collection.updateOne(
      { username: decodedToken.username },
      { $set: { favoritesItems } }
    );

    // 返回更新後的收藏清單
    return favoritesItems;
  } catch (error) {
    // 錯誤處理邏輯
    console.error(error);
  }
}

async function getFavorites(token, databaseName, collectionName) {
  try {
    await client.connect();
    const database = client.db(databaseName);
    const collection = database.collection(collectionName);
    const decodedToken = jwt.verify(token, "userLoginKey");
    const user = await collection.findOne({ username: decodedToken.username });
    const favoritesItems = user.favoritesItems || [];
    return favoritesItems;
  } catch (error) {
    console.error(error);
  }
}

module.exports = {
  getUsers,
  searchUser,
  deleteUser,
  addUser,
  updateUser,
  registerUser,
  loginUser,
  handleFavorite,
  getFavorites,
};
