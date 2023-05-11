import React from "react";
import UsersDataForm from "./components/UsersDataForm";
import AddDataPart from "./components/AddDataPart";
import SearchPartandDeletePart from "./components/SeachPart";

function App() {
  return (
    <div
      style={{
        position: "relative",
        display: "flex",
        justifyContent: "center",
        flexDirection: "column",
        alignItems: "center",
        paddingTop: "20px",
      }}
    >
      <UsersDataForm />
      <AddDataPart />
      <SearchPartandDeletePart />
    </div>
  );
}

export default App;
