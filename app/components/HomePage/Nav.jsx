"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import Profile from "../user/Profile";

const Navbar = () => {
  const [isSticky, setIsSticky] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setIsSticky(window.scrollY > 0);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const hiddenPaths = [
    "/daily-reward",
    "/referrals",
    "/referrals",
    "/quests/",
    "/more",
  ];
  const showNavbar = pathname
    ? !hiddenPaths.some((path) => pathname.startsWith(path))
    : true;

  if (!showNavbar) return null; // Hide Navbar if the path starts with '/'

  return (
    <nav
      className={`fixed bg-gray-950 sm:px-4 top-0 left-0 text-xs right-0 z-50 transition-all duration-300 font-cinzel ${
        isSticky
          ? "bg-gradient-to-b from-gray-950 from-5% to-gray-900 shadow-md"
          : "bg-gray-950"
      }`}>
      <div className="mx-auto px-1 md:px-4 py-3 sm:py-4 flex justify-between items-center">
        <Link
          href="/"
          className="flex items-center space-x-2 animate-bounce-in-down">
          <Image
            src="https://chain-trail.github.io/Quests/Images/Logo.svg"
            alt="Logo"
            width={30}
            height={30}
            className="w-6 md:w-7 lg:w-8"
          />
          <span className="text-xs xs:text-lg lg:text-xl font-bold hover:text-gold-500">
            CHAIN TRAIL
          </span>
        </Link>
        <div className="animate-bounce-in-down focus:outline-none">
          <Profile />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
