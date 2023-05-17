import HomePage from "../pages/HomePage";
import LoginPage from "../pages/LoginPage";
import SignupPage from "../pages/SignupPage"
import { createBrowserRouter } from "react-router-dom";

const router = createBrowserRouter([
  { path: "/home", element: <HomePage /> },
  { path: "/", element: <LoginPage /> },
  { path: "/signup", element: <SignupPage /> },
]);

export default router;
