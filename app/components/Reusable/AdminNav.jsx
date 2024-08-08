import Link from "next/link";
import { IoClose } from "react-icons/io5";
import { useState } from "react";
import { MdDelete } from "react-icons/md";
import { IoMdCreate } from "react-icons/io";
import { FaRegEdit, FaHouseUser } from "react-icons/fa";
import { HiOutlineMenuAlt2 } from "react-icons/hi";

const navItems = [
  { name: "Users", path: "/a/users", icon: <FaHouseUser /> },
  { name: "New Quest", path: "/a/new-quest", icon: <IoMdCreate /> },
  { name: "Edit Quest", path: "/a/edit-quest", icon: <FaRegEdit /> },
  { name: "New Question", path: "/a/new-question", icon: <IoMdCreate /> },
  { name: "Edit Question", path: "/a/edit-question", icon: <FaRegEdit /> },
  { name: "Delete Quest", path: "/a/delete-quest", icon: <MdDelete /> },
];

export default function AdminNav() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleNav = () => setIsOpen(!isOpen);

  return (
    <aside className="text-sm md:text-base">
      <button onClick={toggleNav} className="text-2xl md:text-3xl">
        {isOpen ? <IoClose /> : <HiOutlineMenuAlt2 />}
      </button>
      <nav
        className={`fixed top-16 right-0 h-full w-40 md:w-52 bg-neutral-950 text-white transform ${
          isOpen ? "translate-x-0" : "translate-x-full"
        } transition-transform duration-300 ease-in-out z-40`}>
        <ul className="flex flex-col mt-16">
          {navItems.map((item) => (
            <li key={item.name}>
              <Link href={item.path} passHref>
                <div className="flex items-center p-4 hover:bg-neutral-800 cursor-pointer">
                  <span className="mr-3">{item.icon}</span>
                  {item.name}
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}
