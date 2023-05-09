const express = require('express');
const { ApolloServer, gql } = require('apollo-server-express');
const path = require('path');
// const fs = require('fs');
require('dotenv').config();
const { MongoClient,  ObjectId } = require('mongodb');


const uri = process.env.DB_HOST;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

const app = express();

async function getUsers() {
  try {
    await client.connect();

    const databaseName = 'usersData'; // 指定資料庫名稱
    const collectionName = 'Data'; // 指定 collection 名稱

    const database = client.db(databaseName);
    const collection = database.collection(collectionName);

    const users = await collection.find({}).toArray(); // 從資料庫中取出所有用戶資料

    return users; // 返回用戶資料
  } catch (error) {
    console.error(error);
  } finally {
    client.close(); // 關閉連線
  }
}

///添加資料到資料庫
async function addUser(userInput) {
  try {
    await client.connect();
    const databaseName = 'usersData';
    const collectionName = 'Data';
    const database = client.db(databaseName);
    const collection = database.collection(collectionName);
    const result = await collection.insertOne(userInput);
    console.log(`User with id ${result.insertedId} has been added to the database.`);
  } catch (error) {
    console.error(error);
  } finally {
    client.close();
  }
}

////搜尋功能
async function searchUser(searchTerm) {
  try {
    await client.connect();

    const databaseName = 'usersData'; // 指定資料庫名稱
    const collectionName = 'Data'; // 指定 collection 名稱

    const database = client.db(databaseName);
    const collection = database.collection(collectionName);

    const users = await collection.find({
      $or: [
        { id: { $regex: searchTerm, $options: 'i' } },
        { name: { $regex: searchTerm, $options: 'i' } },
        { email: { $regex: searchTerm, $options: 'i' } },
        { workplace: { $regex: searchTerm, $options: 'i' } },
        { worktitle: { $regex: searchTerm, $options: 'i' } },
        { address: { $regex: searchTerm, $options: 'i' } },
        { tel: { $regex: searchTerm, $options: 'i' } },
        { mobilephone: { $regex: searchTerm, $options: 'i' } }
      ]
    }).toArray(); // 搜索匹配的用戶資料

    return users; // 返回用戶資料
  } catch (error) {
    console.error(error);
  } finally {
    client.close(); // 關閉連線
  }
}

async function deleteUser(id) {
  try {
    await client.connect();

    const databaseName = 'usersData'; // 指定資料庫名稱
    const collectionName = 'Data'; // 指定 collection 名稱

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



const typeDefs = gql`
  type Query {
    hello: String
    userdata: [Data]
    searchUsers(searchTerm: String!): [User]
  }

  type Data {
    id: String
    name: String
    email: String
    workplace: String
    worktitle: String
    address: String
    tel: String
    mobilephone: String
  }
  
  type User {
    dataId:ID
    id:String
    name: String
    email: String
    workplace: String
    worktitle: String
    address: String
    tel: String
    mobilephone: String
  }

  type Mutation {
    addUser(userInput: UserInput!): String
    deleteUser(id: String!): String
  }

  input UserInput {
    id:String!
    name: String!
    email: String!
    workplace: String!
    worktitle: String!
    address: String!
    tel: String!
    mobilephone: String!
  }
`;

const resolvers = {
  Query: {
    hello: () => 'Hello World!',
    userdata: () => getUsers(),
    searchUsers: async (_, { searchTerm }) => {
      try {
        const users = await searchUser(searchTerm);
        return users.map(user => ({ ...user, id: user._id.toString() }));
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
    addUser: (_, args) => addUser(args.userInput),
    deleteUser: (_, { id }) => deleteUser(id)
  }
};

const server = new ApolloServer({ typeDefs, resolvers });

// 啟動 GraphQL 伺服器
async function startApolloServer() {
  await server.start();

  // 加入 middleware
  server.applyMiddleware({ app });

  // 設定允許跨域的網址，本例只允許本地 3000 端口的訪問
  const allowedOrigins = ['http://localhost:3000'];

  app.use((req, res, next) => {
    const origin = req.headers.origin;
    if (allowedOrigins.includes(origin)) {
      res.setHeader('Access-Control-Allow-Origin', origin);
    }
    // 設定允許的方法和標頭
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    next(); // 繼續處理請求
  });

  const port = 4000;
  app.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
  });
}

startApolloServer();
