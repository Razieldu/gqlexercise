import { Link } from "react-router-dom";
import { useState } from "react";
const LoginPage = () => {
  const [userPassword, setUserPassword] = useState("");
  const [userCount, setUserCount] = useState("");
  const handlePassword = (event) => {
    setUserPassword(event.target.value);
    console.log(userPassword);
  };

  const handleCount = (event) => {
    setUserCount(event.target.value);
    console.log(userCount);
  };

  const submitHandler = (event) => {
    event.preventDefault();
    console.log({ userCount, userPassword });
  };
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        gap: "100px",
        width: "100vw",
        height: "100vh",
      }}
    >
      <h1>LoginPage</h1>
      <form onSubmit={submitHandler}>
        <div>
          <div>
            <label>帳號 : </label>
            <input onChange={handleCount} />
          </div>
          <div>
            <label>密碼 : </label>
            <input onChange={handlePassword} />
          </div>
          <p>尚未成為會員嗎? 點擊前往註冊 </p>
        </div>
        <div style={{ textAlign: "center" }}>
          <button>
            <Link
              style={{ textDecoration: "none", color: "black" }}
              to={"/home"}
            >
              登入
            </Link>
          </button>
        </div>
      </form>
      {/* <Link to={"/home"}>前往首頁</Link> */}
    </div>
  );
};

export default LoginPage;
