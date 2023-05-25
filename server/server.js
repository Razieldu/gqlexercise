const { typeDefs } = require("./GQL/typedef");
const { resolvers } = require("./GQL/resolver");
const { tokenVerify } = require("./GQL/context");
const { handleError } = require("./GQL/error");
const express = require("express");
const { ApolloServer } = require("apollo-server-express");
// const fs = require('fs');
const app = express();

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: tokenVerify,
  formatError: handleError,
});

// 啟動 GraphQL 伺服器
async function startApolloServer() {
  await server.start();

  // 加入 middleware
  server.applyMiddleware({ app });

  // 設定允許跨域的網址，本例只允許本地 3000 端口的訪問
  const allowedOrigins = ["http://localhost:3000"];

  app.use((req, res, next) => {
    const origin = req.headers.origin;
    if (allowedOrigins.includes(origin)) {
      res.setHeader("Access-Control-Allow-Origin", origin);
    }
    // 設定允許的方法和標頭
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    next(); // 繼續處理請求
  });

  const port = 4000;
  app.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
  });
}

startApolloServer();
