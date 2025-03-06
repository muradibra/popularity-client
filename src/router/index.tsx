import { createBrowserRouter } from "react-router-dom";
import AuthLayout from "@/layouts/auth";
import RootLayout from "@/layouts/root";
import HomePage from "@/pages/home";
import LoginPage from "@/pages/login";
import { PATHS } from "@/constants/paths";
import ProgramDetailPage from "@/pages/detail";

export const router = createBrowserRouter([
  {
    path: "",
    element: <RootLayout />,
    children: [
      {
        path: PATHS.HOME,
        element: <HomePage />,
      },
      {
        path: PATHS.DETAIL,
        element: <ProgramDetailPage />,
      },
    ],
  },
  {
    path: "",
    element: <AuthLayout />,
    children: [
      {
        path: "/login",
        element: <LoginPage />,
      },
    ],
  },
]);
