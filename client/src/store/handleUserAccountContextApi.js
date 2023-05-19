import React, { useState,useEffect } from "react";

export const userAccountContextAPi = React.createContext();
export const UserAccountProvider = (props) => {
  const [token, setToken] = useState(null);
  const [isLoggedIn,setIsLoggedIn]=useState(false)

  useEffect(() => {
    // 從 localStorage 中檢查是否有存儲的令牌
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      setToken(storedToken);
      setIsLoggedIn(true);
      console.log("發動")
    }
  }, []);

  const login = (token) => {
    // 將令牌存儲在 localStorage
    console.log(token)
    localStorage.setItem('token', token);
    setToken(token);
    setIsLoggedIn(true);
  };

  const logout = () => {
    // 從 localStorage 中移除令牌
    localStorage.removeItem('token');
    setToken(null);
    setIsLoggedIn(false);
  };


  const contextValue = {
    token,
    isLoggedIn,
    setToken,
    login,
    logout,
  };

  return (
    <userAccountContextAPi.Provider value={contextValue}>
      {props.children}
    </userAccountContextAPi.Provider>
  );
};


