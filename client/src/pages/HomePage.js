import React, { useContext } from "react";
import UsersDataForm from "../components/UsersDataForm";
import AddDataPart from "../components/AddDataPart";
import SearchPartandDeletePart from "../components/SeachPart";
import UpdateDataPart from "../components/UpdateDataPart";
import NavigationBar from "../components/NavigationBar";
import { userAccountContextAPi } from "../store/handleUserAccountContextApi";
import { Navigate } from "react-router-dom";
const HomePage = () => {
  const { isLoggedIn } = useContext(userAccountContextAPi);
  console.log(isLoggedIn)
  //  console.log(isLoggedIn)
  //   const navigate =useNavigate()
  //   if(!isLoggedIn){
  //     navigate("/")
  //   }
  if (isLoggedIn) {
    return (
      <div>
        <NavigationBar />
        <div
          style={{
            position: "relative",
            display: "flex",
            justifyContent: "center",
            flexDirection: "column",
            alignItems: "center",
            paddingTop: "100px",
          }}
        >
          <UsersDataForm />
          <AddDataPart />
          <UpdateDataPart />
          <SearchPartandDeletePart />
        </div>
      </div>
    );
  }else{
     return< Navigate to="/"/>
  }
};
export default HomePage;
