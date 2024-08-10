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
      <div className="p-4 bg-gray-900 min-h-screen">
        <h1 className="text-2xl font-bold text-white mb-4">All Users</h1>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y-2 divide-gray-200 bg-white text-sm dark:divide-gray-700 dark:bg-gray-900">
            <thead>
              <tr className="bg-gray-700 border-b border-gray-600">
                <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900 dark:text-white">
                  ID
                </th>
                <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900 dark:text-white">
                  User ID
                </th>
                <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900 dark:text-white">
                  Username
                </th>
                <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900 dark:text-white">
                  Points
                </th>
                <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900 dark:text-white">
                  Registered On
                </th>
                <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900 dark:text-white">
                  Role
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {[...Array(usersPerPage)].map((_, index) => (
                <tr
                  key={index}
                  className="border-b border-gray-600 animate-pulse">
                  <td className="whitespace-nowrap px-4 py-2 text-gray-700 dark:text-gray-200">
                    .
                  </td>
                  <td className="whitespace-nowrap px-4 py-2 text-gray-700 dark:text-gray-200">
                    .
                  </td>
                  <td className="whitespace-nowrap px-4 py-2 text-gray-700 dark:text-gray-200">
                    .
                  </td>
                  <td className="whitespace-nowrap px-4 py-2 text-gray-700 dark:text-gray-200">
                    .
                  </td>
                  <td className="whitespace-nowrap px-4 py-2 text-gray-700 dark:text-gray-200">
                    .
                  </td>
                  <td className="whitespace-nowrap px-4 py-2 text-gray-700 dark:text-gray-200">
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
    <div className="p-4 bg-gray-900 min-h-screen">
      <div className="flex text-yellow-500 justify-start gap-2 items-center p-4">
        <AdminNav />
        <h1 className="text-2xl font-bold">Registered Users</h1>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y-2 divide-gray-200 bg-white text-sm dark:divide-gray-700 dark:bg-gray-900">
          <thead>
            <tr className="bg-gray-700 border-b border-gray-600">
              <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900 dark:text-white">
                ID
              </th>
              <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900 dark:text-white">
                User ID
              </th>
              <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900 dark:text-white">
                Username
              </th>
              <th
                className="whitespace-nowrap px-4 py-2 font-medium text-gray-900 dark:text-white cursor-pointer"
                onClick={() => {
                  setSortField("points");
                  setSortDirection(sortDirection === "asc" ? "desc" : "asc");
                }}>
                Points{" "}
                {sortField === "points" &&
                  (sortDirection === "asc" ? "↑" : "↓")}
              </th>
              <th
                className="whitespace-nowrap px-4 py-2 font-medium text-gray-900 dark:text-white cursor-pointer"
                onClick={() => {
                  setSortField("registeredOn");
                  setSortDirection(sortDirection === "asc" ? "desc" : "asc");
                }}>
                Registered On{" "}
                {sortField === "registeredOn" &&
                  (sortDirection === "asc" ? "↑" : "↓")}
              </th>
              <th
                className="whitespace-nowrap px-4 py-2 font-medium text-gray-900 dark:text-white cursor-pointer"
                onClick={() => {
                  setSortField("role");
                  setSortDirection(sortDirection === "asc" ? "desc" : "asc");
                }}>
                Role{" "}
                {sortField === "role" && (sortDirection === "asc" ? "↑" : "↓")}
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {currentUsers.map((user, index) => (
              <tr key={user._id} className="border-b border-gray-600">
                <td className="whitespace-nowrap px-4 py-2 font-medium text-gray-900 dark:text-white">
                  {indexOfFirstUser + index + 1}
                </td>
                <td className="whitespace-nowrap px-4 py-2 text-gray-700 dark:text-gray-200 overflow-hidden">
                  <button
                    onClick={() => copyUserId(user.userId.toString())}
                    className="hover:underline max-w-36">
                    {user.userId}
                  </button>
                </td>
                <td className="whitespace-nowrap px-4 py-2 max-w-36 text-gray-700 dark:text-gray-200">
                  {user.username}
                </td>
                <td className="whitespace-nowrap px-4 py-2 max-w-36 text-gray-700 dark:text-gray-200">
                  {user.points}
                </td>
                <td className="whitespace-nowrap px-4 py-2 max-w-36 text-gray-700 dark:text-gray-200">
                  {new Date(user.createdAt).toLocaleDateString()}
                </td>
                <td className="whitespace-nowrap px-4 py-2 max-w-36 text-gray-700 dark:text-gray-200">
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
            className={`px-4 py-2 border rounded-lg text-white bg-gray-700 border-gray-600 ${
              currentPage === 1 ? "opacity-50 cursor-not-allowed" : ""
            }`}
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}>
            Prev
          </button>
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i + 1}
              className={`px-4 py-2 border rounded-lg ${
                currentPage === i + 1
                  ? "text-yellow-500 bg-gray-700 border-gray-600"
                  : "text-white bg-gray-800 border-gray-700"
              }`}
              onClick={() => handlePageChange(i + 1)}>
              {i + 1}
            </button>
          ))}
          <button
            className={`px-4 py-2 border rounded-lg text-white bg-gray-700 border-gray-600 ${
              currentPage === totalPages ? "opacity-50 cursor-not-allowed" : ""
            }`}
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}>
            Next
          </button>
        </div>
      </div>
      <ToastContainer />
      <SideNav />
    </div>
  );
}
