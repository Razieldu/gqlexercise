import React from "react";
import UsersDataForm from "./components/UsersDataForm";
import AddDataPart from "./components/AddDataPart";
import SearchPartandDeletePart from "./components/SeachPart";
import UpdateDataPart from "./components/UpdateDataPart";
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
      <UpdateDataPart/>
      <SearchPartandDeletePart />
    </div>
  );
}

export default App;
