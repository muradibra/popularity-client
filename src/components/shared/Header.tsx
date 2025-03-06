import logo from "@/assets/images/logo.svg";
import { navItems } from "@/constants/navItems";
import { TNavItem } from "@/constants/types";
import { cn } from "@/lib/utils";
import { MenuIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";

export const Header = () => {
  const [activeItem, setActiveItem] = useState<string | null>(null);
  const location = useLocation();

  useEffect(() => {
    const path = location.pathname;
    const pathName = path === "/" ? "home" : path.split("/")[1];
    setActiveItem(pathName);
  }, [location.pathname]);

  const handleNavClick = (name: string) => {
    setActiveItem(name);
  };

  return (
    <header className="bg-white shadow-lg text-sm font-roboto fixed top-0 w-full z-10 shadow-slate-200 mb-3 px-5">
      <nav className="flex gap-10 justify-between lg:justify-start items-center p-3">
        <div className="logo-wrapper w-6 h-6">
          <img src={logo} alt="Logo" className="w-full h-full object-cover" />
        </div>

        <div className="lg:flex w-full hidden items-center justify-between">
          <ul className="flex items-center font-medium gap-2">
            {navItems.map((navItem: TNavItem) => (
              <li
                className={cn(
                  "cursor-pointer px-2 py-1 block rounded-md",
                  activeItem === navItem.name
                    ? "bg-[#123d93cc] text-white"
                    : "bg-white text-black"
                )}
                key={navItem.name}
              >
                <Link
                  to={navItem.path!}
                  onClick={() => handleNavClick(navItem.name)}
                  className="capitalize"
                >
                  {navItem.icon
                    ? navItem.icon && <navItem.icon />
                    : navItem.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <button className="menu-icon lg:hidden">
          <MenuIcon />
        </button>
      </nav>
    </header>
  );
};
