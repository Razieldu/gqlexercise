import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { ApolloProvider } from "@apollo/client";
import client from "./apollo";
import { SearchDataHandlerContextProvider } from "./store/handleSearchContextApi";
import { UserAccountProvider } from "./store/handleUserAccountContextApi";
import { RouterProvider } from "react-router-dom";
import router from "./routers.js/routers";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <ApolloProvider client={client}>
    <UserAccountProvider>
      <SearchDataHandlerContextProvider>
        <RouterProvider router={router} />
      </SearchDataHandlerContextProvider>
    </UserAccountProvider>
  </ApolloProvider>
);
