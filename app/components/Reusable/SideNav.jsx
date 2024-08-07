"use client";
import Link from "next/link";
import { useTelegramAuth } from "@/app/TelegramAuthProvider";
import { useEffect, useState } from "react";

const SideNav = () => {
  const { userInfo, isLoading } = useTelegramAuth();
  const [navLinks, setNavLinks] = useState([
    { href: "/", title: "Home" },
    { href: "/quests", title: "Quests" },
    { href: "/collection", title: "Collections" },
    { href: "/referrals", title: "Account" },
  ]);

  useEffect(() => {
    console.log("Current userInfo:", userInfo); // Debugging: Log userInfo

    if (userInfo?.role === "admin") {
      console.log("User is an admin"); // Debugging: Confirm admin status
      setNavLinks((prevLinks) => {
        if (!prevLinks.some((link) => link.title === "Admin")) {
          return [...prevLinks, { href: "/Admin/new-quest", title: "Admin" }];
        }
        return prevLinks;
      });
    } else {
      console.log("User is not an admin"); // Debugging: Confirm non-admin status
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
                className="block p-4 hover:bg-neutral-700 rounded transition duration-200 text-sm">
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
