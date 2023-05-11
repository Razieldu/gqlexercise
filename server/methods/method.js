require("dotenv").config();
const { MongoClient, ObjectId } = require("mongodb");

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

module.exports = {
  getUsers,
  searchUser,
  deleteUser,
  addUser
};
