const jwt = require("jsonwebtoken");

const tokenVerify = async ({ req }) => {
    let user = null;
    try {
      const token = req.headers.authorization || "";
      const tokenWithoutBearer = token.replace("Bearer ", "");
     
      if (token) {
        const decoded = jwt.verify(tokenWithoutBearer, "userLoginKey");
        user = decoded.username;
      }
    } catch (error) {
      console.log("JWT 驗證失敗：", error);
    }
    console.log(user)
    return { user };
  };
  

  module.exports = {
    tokenVerify
  };
  