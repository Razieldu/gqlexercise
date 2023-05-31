import React, { useContext} from "react";
import UsersDataForm from "../../components/UsersDataForm/UsersDataForm";
import AddDataPart from "../../components/AddDataPart/AddDataPart";
import SearchPartandDeletePart from "../../components/SearchPart/SearchPart";
import UpdateDataPart from "../../components/UpdateDataPart/UpdateDataPart";
import NavigationBar from "../../components/NavigationBar/NavigationBar";
import { userAccountContextAPi } from "../../store/handleUserAccountContextApi";
import { Navigate } from "react-router-dom";
import "./HomePage.scss";
const HomePage = () => {
  const { isLoggedIn } = useContext(userAccountContextAPi);
  if (isLoggedIn) {
    return (
      <>
        <NavigationBar />
        <div className="mainContent">
          <UsersDataForm />
          <AddDataPart />
          <UpdateDataPart />
          <SearchPartandDeletePart />
        </div>
      </>
    );
  } else {
    return <Navigate to="/" />;
  }
};
export default HomePage;
