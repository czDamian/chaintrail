"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import {
  FaHome,
  FaTasks,
  FaBox,
  FaUser,
  FaLock,
  FaWallet,
} from "react-icons/fa";
import { useAuth } from "@/app/AuthenticationProvider";

const SideNav = () => {
  const pathname = usePathname();
  const { userInfo } = useAuth();

  const [navLinks, setNavLinks] = useState([
    { href: "/", title: "Home", icon: FaHome },
    { href: "/quests", title: "Quests", icon: FaTasks },
    { href: "/collection", title: "Collections", icon: FaBox },
    { href: "/earn", title: "Earn", icon: FaUser },
    { href: "/wallet", title: "Wallet", icon: FaWallet },
  ]);

  useEffect(() => {
    if (userInfo?.role === "admin") {
      setNavLinks((prevLinks) => {
        if (!prevLinks.some((link) => link.title === "Admin")) {
          return [
            ...prevLinks,
            { href: "/a/users", title: "Admin", icon: FaLock },
          ];
        }
        return prevLinks;
      });
    } else {
      setNavLinks((prevLinks) =>
        prevLinks.filter((link) => link.title !== "Admin")
      );
    }
  }, [userInfo]);

  return (
    <nav className="fixed bottom-0 left-0 w-full bg-gradient-to-b from-blue-950 to-gray-950 text-white z-50">
      <ul className="flex justify-between items-center">
        {navLinks.map((link, index) => {
          const isActive = pathname === link.href;

          return (
            <li key={index} className="flex-1">
              <Link
                href={link.href}
                className={`flex flex-col items-center justify-center rounded transition duration-300 py-4 px-1 sm:px-2 md:py-5 hover:bg-blue-900 ${
                  isActive ? "bg-blue-900" : ""
                }`}>
                <link.icon className="text-lg sm:text-xl mb-1" />
                <span className="text-[10px] sm:text-xs md:text-sm whitespace-nowrap">
                  {link.title}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
};

export default SideNav;
