import HomePage from "../pages/HomePage";
import LoginPage from "../pages/LoginPage";
import { createBrowserRouter } from "react-router-dom";

const router = createBrowserRouter([
  { path: "/home", element: <HomePage /> },
  { path: "/", element: <LoginPage /> },
]);

export default router;
