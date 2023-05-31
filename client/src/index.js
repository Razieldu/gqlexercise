import React from "react";
import ReactDOM from "react-dom/client";
import "./index.scss";
import { ApolloProvider } from "@apollo/client";
import client from "./GQL/apollo";
import { SearchDataHandlerContextProvider } from "./store/handleSearchContextApi";
import { UserAccountProvider } from "./store/handleUserAccountContextApi";
import { RouterProvider } from "react-router-dom";
import router from "./routers/routers";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <ApolloProvider client={client}>
    <SearchDataHandlerContextProvider>
      <UserAccountProvider>
        <RouterProvider router={router} />
      </UserAccountProvider>
    </SearchDataHandlerContextProvider>
  </ApolloProvider>
);
