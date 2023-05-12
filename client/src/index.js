import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { ApolloProvider } from "@apollo/client";
import client from "./apollo";
import { SearchDataHandlerContextProvider } from "./store/handleSearchContextApi";
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <ApolloProvider client={client}>
    <SearchDataHandlerContextProvider>
      <App />
    </SearchDataHandlerContextProvider>
  </ApolloProvider>
);
