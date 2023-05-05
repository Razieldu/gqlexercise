const express = require('express');
const { ApolloServer, gql } = require('apollo-server-express');
const path = require('path');
// const fs = require('fs');
require('dotenv').config();
const { MongoClient } = require('mongodb');

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

const typeDefs = gql`
  type Query {
    hello: String
    userdata: [Data]
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
`;

const resolvers = {
  Query: {
    hello: () => 'Hello World!',
    userdata: () => getUsers()
    // () => {
    //   //本地端拿資料
    //   const rawData = fs.readFileSync(path.join(__dirname, 'data.json'));
    //   const data = JSON.parse(rawData);
    //   return data;
    // }
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