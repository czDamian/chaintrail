import Link from "next/link";
import { RiMenu3Fill } from "react-icons/ri";
import { IoClose } from "react-icons/io5";
import { useState } from "react";
import { MdDelete } from "react-icons/md";
import { IoMdCreate } from "react-icons/io";
import { FaRegEdit, FaHouseUser } from "react-icons/fa";

const navItems = [
  { name: "Users", path: "/admin/users", icon: <FaHouseUser /> },
  { name: "New Quest", path: "/admin/new-quest", icon: <IoMdCreate /> },
  { name: "Edit Quest", path: "/admin/edit-quest", icon: <FaRegEdit /> },
  { name: "New Question", path: "/admin/new-question", icon: <IoMdCreate /> },
  { name: "Edit Question", path: "/admin/edit-question", icon: <FaRegEdit /> },
  { name: "Delete Quest", path: "/admin/delete-quest", icon: <MdDelete /> },
];

export default function AdminNav() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleNav = () => setIsOpen(!isOpen);

  return (
    <aside className="text-sm md:text-base">
      <button
        onClick={toggleNav}
        className="text-lg md:text-2xl">
        {isOpen ? <IoClose /> : <RiMenu3Fill />}
      </button>
      <nav
        className={`fixed top-16 right-0 h-full w-40 bg-neutral-950 text-white transform ${
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
