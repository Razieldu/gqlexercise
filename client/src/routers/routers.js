import HomePage from "../pages/HomePage/HomePage";
import LoginPage from "../pages/LoginPage/LoginPage";
import SignupPage from "../pages/SignupPage/SignupPage";
import ForgotPasswordPage from "../pages/ForgotPasswordPage/ForgotPasswordPage";
import NewPasswordPage from "../pages/NewPasswordPage/NewPasswordPage";
import { createBrowserRouter } from "react-router-dom";

const router = createBrowserRouter([
  { path: "/home", element: <HomePage /> },
  { path: "/", element: <LoginPage /> },
  { path: "/signup", element: <SignupPage /> },
  { path: "/forgotPassword", element: <ForgotPasswordPage /> },
  {
    path: "/newPassword/:id",
    element: <NewPasswordPage />,
    loader: ({ params }) => {
    return params.id;
    },
  },
]);

export default router;
