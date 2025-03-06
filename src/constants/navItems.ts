import { BellIcon, NewspaperIcon } from "lucide-react";
import { PATHS } from "./paths";

export const navItems = [
  {
    name: "home",
    path: PATHS.HOME,
    icon: null,
  },
  {
    name: "trending",
    path: PATHS.TRENDING,
    icon: null,
  },
  {
    name: "subcriptions",
    path: PATHS.SUBSCRIPTION,
    icon: null,
  },
  {
    name: "upload",
    path: PATHS.UPLOAD,
    icon: null,
  },
  {
    name: "news",
    path: PATHS.NEWS,
    icon: NewspaperIcon,
  },
  {
    name: "notifications",
    path: PATHS.NOTIFICATIONS,
    icon: BellIcon,
  },
];
