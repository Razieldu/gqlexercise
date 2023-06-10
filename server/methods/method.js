require("dotenv").config();
const { MongoClient, ObjectId } = require("mongodb");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const { errorMonitor } = require("nodemailer/lib/xoauth2");
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
    console.log(userInfo);
    const existingUser = await collection.findOne({
      username: userInfo.username,
    });
    if (existingUser) {
      console.log("用户名已存在");
      return { userData: null, message: { message: "用戶名已存在" } }; // 如果用户名已存在，停止注册流程并返回 null
    }
    let otherData = {
      favoritesItems: [],
      userRole: "",
      displayname: userInfo.displayname,
    };
    if (userInfo.username === "s202032808@gmail.com") {
      otherData.userRole = "ADMIN";
    } else {
      otherData.userRole = "MEMBER";
    }
    let newUserData = { ...userInfo, ...otherData };
    console.log(newUserData);
    let { username, password, displayname } = newUserData;
    // 对密码进行哈希加密
    const hashedPassword = await bcrypt.hash(password, 10);

    // 替换原始密码为哈希值
    newUserData.password = hashedPassword;

    const result = await collection.insertOne(newUserData);
    console.log(
      `User with id ${result.insertedId} has been added to the database.`
    );

    const userData = {
      token: jwt.sign(
        { username, userRole: otherData.userRole },
        "userLoginKey"
      ),
      username: username,
      displayname: displayname,
      favoritesItems: [],
    };

    const message = {
      message: "註冊成功",
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
      token: jwt.sign(
        { username, userRole: existingUser.userRole },
        "userLoginKey"
      ),
      username: existingUser.username,
      displayname: existingUser.displayname,
      favoritesItems: existingUser.favoritesItems,
      // userRole: existingUser.userRole,
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

async function resetPassword(email, databaseName, collectionName) {
  try {
    await client.connect();
    const database = client.db(databaseName);
    let collection = database.collection(collectionName);
    const user = await collection.findOne({
      username: email,
    });
    console.log(user);
    if (!user) {
      return { status: false, message: { message: "帳號不存在" } };
    }
    const token = jwt.sign(
      {
        username: email,
      },
      `RESETPASSWORD${Math.random() * 1000}`,
      { expiresIn: "1h" }
    );

    const verifyData = { email, token };
    collection = database.collection("resetPasswordArea");
    const alreadyExistingOne = await collection.findOne({
      email: email,
    });
    if (alreadyExistingOne?.email === email)
      await collection.deleteOne(alreadyExistingOne);
    await collection.insertOne(verifyData);
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        type: "OAuth2",
        user: "s202032808@gmail.com",
        clientId: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        refreshToken: process.env.GOOGLE_REFRESH_TOKEN,
        accessToken: process.env.GOOGLE_ACCESS_TOKEN,
      },
    });

    const mailOptions = {
      from: "s202032808@gmail.com", // 发送方邮箱地址
      to: email, // 接收方邮箱地址
      subject: "密碼重置信", // 邮件主题
      text: `點擊重置密碼：\n\nhttp://localhost:3000/newPassword/${token}`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error("发送邮件时出现错误:", error);
      } else {
        console.log("邮件发送成功:", info.response);
      }
    });

    return {
      status: true,
      message: { message: "重置郵件已寄送" },
    };
  } catch (error) {
    console.error(error);
  }
}

async function findTokenToVerifyReset(token) {
  try {
    await client.connect();
    const database = client.db("userAccountData");
    let collection = database.collection("resetPasswordArea");
    let result = await collection.findOne({ token });
    if (!result) {
      throw new Error("token驗證錯誤");
    }
    return { permission: true, email: result.email };
  } catch (error) {
    console.log(error);
  }
}

async function updatePasswordAndSignIn(password, email) {
  try {
    await client.connect();
    const database = client.db("userAccountData");
    const collection = database.collection("userNamePasswordData");
    const hashedPassword = await bcrypt.hash(password, 10);
    await collection.updateOne({ username:email }, { $set: { password:hashedPassword } });
    let dataOfUser = await collection.findOne({ username: email });
    console.log(dataOfUser);
    delete dataOfUser.password;
    dataOfUser.token = jwt.sign(
      { username: dataOfUser.username, userRole: dataOfUser.userRole },
      "userLoginKey"
    );
    return {
      userData: dataOfUser,
      message: { message: "密碼重製成功" },
    };
  } catch (error) {
    console.log(error);
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
  resetPassword,
  findTokenToVerifyReset,
  updatePasswordAndSignIn,
};



// {
//   "username": "s202032808@gmail.com",
//   "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyUm9sZSI6IkFETUlOIiwiaWF0IjoxNjg2NDAxMDk5fQ.ZV6mVSU2GNHVGoBRFBWkCWcpSqgIzq6f9CHcVoGtxrQ",
//   "favoritesItems": [
//       {
//           "dataId": "645b780c209079ebb57968c6",
//           "__typename": "Favorites"
//       },
//       {
//           "dataId": "645b780c209079ebb57968d3",
//           "__typename": "Favorites"
//       },
//       {
//           "dataId": "645b780c209079ebb57968d1",
//           "__typename": "Favorites"
//       },
//       {
//           "dataId": "645b780c209079ebb57968c8",
//           "__typename": "Favorites"
//       },
//       {
//           "dataId": "645b780c209079ebb57968d8",
//           "__typename": "Favorites"
//       },
//       {
//           "dataId": "645b780c209079ebb57968e1",
//           "__typename": "Favorites"
//       },
//       {
//           "dataId": "645b780c209079ebb57968ea",
//           "__typename": "Favorites"
//       },
//       {
//           "dataId": "645b780c209079ebb57968f9",
//           "__typename": "Favorites"
//       },
//       {
//           "dataId": "645b780c209079ebb57968d4",
//           "__typename": "Favorites"
//       },
//       {
//           "dataId": "645b780c209079ebb57968c1",
//           "__typename": "Favorites"
//       },
//       {
//           "dataId": "645b780c209079ebb57968c2",
//           "__typename": "Favorites"
//       }
//   ],
//   "displayname": "杜承修",
//   "__typename": "UserData"
// }



// {
//   "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InMyMDIwMzI4MDhAZ21haWwuY29tIiwidXNlclJvbGUiOiJBRE1JTiIsImlhdCI6MTY4NjQwMTMyNH0.L8fyit_wDHKCAu17cA7bgrT6qfXoDymJ8gHfIG3CWfo",
//   "username": "s202032808@gmail.com",
//   "displayname": "杜承修",
//   "favoritesItems": [
//       {
//           "dataId": "645b780c209079ebb57968c6",
//           "__typename": "Favorites"
//       },
//       {
//           "dataId": "645b780c209079ebb57968d3",
//           "__typename": "Favorites"
//       },
//       {
//           "dataId": "645b780c209079ebb57968d1",
//           "__typename": "Favorites"
//       },
//       {
//           "dataId": "645b780c209079ebb57968c8",
//           "__typename": "Favorites"
//       },
//       {
//           "dataId": "645b780c209079ebb57968d8",
//           "__typename": "Favorites"
//       },
//       {
//           "dataId": "645b780c209079ebb57968e1",
//           "__typename": "Favorites"
//       },
//       {
//           "dataId": "645b780c209079ebb57968ea",
//           "__typename": "Favorites"
//       },
//       {
//           "dataId": "645b780c209079ebb57968f9",
//           "__typename": "Favorites"
//       },
//       {
//           "dataId": "645b780c209079ebb57968d4",
//           "__typename": "Favorites"
//       },
//       {
//           "dataId": "645b780c209079ebb57968c1",
//           "__typename": "Favorites"
//       },
//       {
//           "dataId": "645b780c209079ebb57968c2",
//           "__typename": "Favorites"
//       }
//   ],
//   "__typename": "UserData"
