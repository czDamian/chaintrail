"use client";

import { useEffect, useState } from "react";
import AdminNav from "@/app/components/Reusable/AdminNav";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import SideNav from "@/app/components/Reusable/SideNav";


export default function UserList() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage] = useState(10);
  const [sortField, setSortField] = useState("points"); // Default sort field
  const [sortDirection, setSortDirection] = useState("asc"); // Default sort direction

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch("/api/users");
        if (!response.ok) {
          throw new Error("Failed to fetch users");
        }
        const data = await response.json();
        setUsers(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  if (loading) {
    return (
      <div className="p-4 bg-neutral-800 min-h-screen">
        <h1 className="text-2xl font-bold text-white mb-4">Registered Users</h1>
        <div className="overflow-x-auto">
          <table className="w-full bg-neutral-700 border border-neutral-600 rounded-lg shadow-md">
            <thead>
              <tr className="bg-neutral-600 border-b border-neutral-500">
                <th className="px-4 py-2 text-left text-neutral-300">ID</th>
                <th className="px-4 py-2 text-left text-neutral-300 max-w-36">
                  User ID
                </th>
                <th className="px-4 py-2 text-left text-neutral-300">
                  Username
                </th>
                <th className="px-4 py-2 text-left text-neutral-300">Points</th>
                <th className="px-4 py-2 text-left text-neutral-300">
                  Registered On
                </th>
                <th className="px-4 py-2 text-left text-neutral-300">Role</th>
              </tr>
            </thead>
            <tbody>
              {[...Array(usersPerPage)].map((_, index) => (
                <tr
                  key={index}
                  className="border-b border-neutral-600 animate-pulse">
                  <td className="px-4 py-2 text-neutral-200 bg-neutral-700">
                    .
                  </td>
                  <td className="px-4 py-2 text-neutral-200 bg-neutral-700">
                    .
                  </td>
                  <td className="px-4 py-2 text-neutral-200 bg-neutral-700">
                    .
                  </td>
                  <td className="px-4 py-2 text-neutral-200 bg-neutral-700">
                    .
                  </td>
                  <td className="px-4 py-2 text-neutral-200 bg-neutral-700">
                    .
                  </td>
                  <td className="px-4 py-2 text-neutral-200 bg-neutral-700">
                    .
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  if (error) return <p className="text-center text-red-500">Error: {error}</p>;

  // Sorting logic
  const sortUsers = (users) => {
    return [...users].sort((a, b) => {
      if (sortField === "registeredOn") {
        return sortDirection === "asc"
          ? new Date(a.createdAt) - new Date(b.createdAt)
          : new Date(b.createdAt) - new Date(a.createdAt);
      }
      if (sortDirection === "asc") {
        return a[sortField] > b[sortField] ? 1 : -1;
      } else {
        return a[sortField] < b[sortField] ? 1 : -1;
      }
    });
  };

  const sortedUsers = sortUsers(users);

  // Pagination logic
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = sortedUsers.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(users.length / usersPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const copyUserId = (userId) => {
    navigator.clipboard.writeText(userId);
    toast.success("UserID copied!");
  };

  return (
    <div className="p-4 bg-neutral-800 min-h-screen">
      <div className="flex text-gold-500 justify-start gap-2 items-center p-4">
        <AdminNav />
        <h1 className="text-2xl font-bold">Registered Users</h1>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full bg-neutral-700 border border-neutral-600 rounded-lg shadow-md">
          <thead>
            <tr className="bg-neutral-600 border-b border-neutral-500">
              <th className="px-4 py-2 text-left text-neutral-300">ID</th>
              <th className="px-4 py-2 text-left text-neutral-300">User ID</th>
              <th className="px-4 py-2 text-left text-neutral-300">Username</th>
              <th
                className="px-4 py-2 text-left text-neutral-300 cursor-pointer"
                onClick={() => {
                  setSortField("points");
                  setSortDirection(sortDirection === "asc" ? "desc" : "asc");
                }}>
                Points
                {sortField === "points" &&
                  (sortDirection === "asc" ? "↑" : "↓")}
              </th>
              <th
                className="px-4 py-2 text-left text-neutral-300 cursor-pointer"
                onClick={() => {
                  setSortField("registeredOn");
                  setSortDirection(sortDirection === "asc" ? "desc" : "asc");
                }}>
                Registered On{" "}
                {sortField === "registeredOn" &&
                  (sortDirection === "asc" ? "↑" : "↓")}
              </th>
              <th
                className="px-4 py-2 text-left text-neutral-300 cursor-pointer"
                onClick={() => {
                  setSortField("role");
                  setSortDirection(sortDirection === "asc" ? "desc" : "asc");
                }}>
                Role{" "}
                {sortField === "role" && (sortDirection === "asc" ? "↑" : "↓")}
              </th>
            </tr>
          </thead>
          <tbody>
            {currentUsers.map((user, index) => (
              <tr key={user._id} className="border-b border-neutral-600">
                <td className="px-4 py-2 text-neutral-200">
                  {indexOfFirstUser + index + 1}
                </td>
                <td className="px-4 py-2 text-neutral-200 overflow-hidden">
                  <button
                    onClick={() => copyUserId(user.userId.toString())}
                    className="hover:underline max-w-36">
                    {user.userId}
                  </button>
                </td>
                <td className="px-4 py-2  max-w-36 text-neutral-200">
                  {user.username}
                </td>
                <td className="px-4 py-2  max-w-36 text-neutral-200">
                  {user.points}
                </td>
                <td className="px-4 py-2  max-w-36 text-neutral-200">
                  {new Date(user.createdAt).toLocaleDateString()}
                </td>
                <td className="px-4 py-2  max-w-36 text-neutral-200">
                  {user.role}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-4 flex justify-center">
        <div className="flex space-x-2">
          <button
            className={`px-4 py-2 border rounded-lg text-white bg-neutral-600 border-neutral-500 ${
              currentPage === 1 ? "opacity-50 cursor-not-allowed" : ""
            }`}
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}>
            Prev
          </button>
          <button
            className={`px-4 py-2 border rounded-lg text-white bg-neutral-600 border-neutral-500 ${
              currentPage === totalPages ? "opacity-50 cursor-not-allowed" : ""
            }`}
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}>
            Next
          </button>
        </div>
      </div>
      <SideNav />
    </div>
  );
}
