export const PATHS = {
  LOGIN: "/login",
  REGISTER: "/register",
  FORGOT_PASSWORD: "/forgot-password",
  RESET_PASSWORD: "/reset-password",
  TRENDING: "/trending",
  SUBSCRIPTION: "/subscription",
  NEWS: "/news",
  NOTIFICATIONS: "/notifications",
  HOME: "/",
  DETAIL: "program/:id",
  // DASHBOARD: "/dashboard",
  // PROFILE: "/profile",
  // NOT_FOUND: "/not-found",
};

export const unauthenticatedRoutes = [
  PATHS.LOGIN,
  PATHS.REGISTER,
  PATHS.FORGOT_PASSWORD,
  PATHS.RESET_PASSWORD,
];
