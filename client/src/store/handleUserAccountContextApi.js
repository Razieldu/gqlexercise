import React, { useState } from "react";

export const userAccountContextAPi = React.createContext();
export const UserAccountProvider = (props) => {
  const [token, setToken] = useState(null);
  
  const contextValue = {
    token,
    setToken,
  };

  return (
    <userAccountContextAPi.Provider value={contextValue}>
      {props.children}
    </userAccountContextAPi.Provider>
  );
};


