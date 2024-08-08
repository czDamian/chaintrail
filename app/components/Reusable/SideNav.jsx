"use client";
import Link from "next/link";
import { useTelegramAuth } from "@/app/TelegramAuthProvider";
import { useEffect, useState } from "react";
import { FaHome, FaTasks, FaBox, FaUser, FaLock } from "react-icons/fa";

const SideNav = () => {
  const { userInfo } = useTelegramAuth();
  const [navLinks, setNavLinks] = useState([
    { href: "/", title: "Home", icon: FaHome },
    { href: "/quests", title: "Quests", icon: FaTasks },
    { href: "/collection", title: "Collections", icon: FaBox },
    { href: "/referrals", title: "Account", icon: FaUser },
  ]);

  useEffect(() => {
    console.log("SideNav userInfo:", userInfo);
    if (userInfo?.role === "admin") {
      setNavLinks((prevLinks) => {
        if (!prevLinks.some((link) => link.title === "Admin")) {
          return [
            ...prevLinks,
            { href: "/admin/new-quest", title: "Admin", icon: FaLock },
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
    <div className="mt-20">
      <div className="fixed bottom-0 left-0 w-full bg-neutral-950 text-white z-50">
        <ul className="flex justify-between">
          {navLinks.map((link, index) => (
            <li key={index}>
              <Link
                href={link.href}
                className="px-4 py-4 sm:px-2 hover:bg-neutral-700 rounded transition duration-200 text-xs md:text-sm flex flex-col items-center">
                <link.icon className="mb-1" />
                {link.title}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default SideNav;
