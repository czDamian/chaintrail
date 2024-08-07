"use client";
import { useState, useEffect, createContext, useContext } from "react";
import { useRouter } from "next/navigation";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const TelegramAuthContext = createContext();

export default function TelegramAuthProvider({ children }) {
  const [userInfo, setUserInfo] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const savedUserId = localStorage.getItem("userId");
    if (savedUserId) {
      fetchUserInfo(savedUserId);
    } else {
      setIsLoading(false);
    }
  }, []);

  const fetchUserInfo = async (userId) => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/users?userId=${userId}`);
      if (response.ok) {
        const userData = await response.json();
        setUserInfo(userData);
        localStorage.setItem("userInfo", JSON.stringify(userData));
      } else {
        console.error("Failed to fetch user data");
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateUserInfo = async (newUserInfo) => {
    try {
      const response = await fetch(`/api/users`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newUserInfo),
      });
      if (response.ok) {
        const updatedUser = await response.json();
        setUserInfo(updatedUser);
        localStorage.setItem("userInfo", JSON.stringify(updatedUser));
        console.log("Updated userInfo:", updatedUser);
      } else {
        console.error("Failed to update user data");
      }
    } catch (error) {
      console.error("Error updating user data:", error);
    }
  };

  const registerOrLogin = async (userId, username) => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId, username }),
      });
      if (response.ok) {
        const userData = await response.json();
        setUserInfo(userData);
        localStorage.setItem("userId", userId);
        localStorage.setItem("userInfo", JSON.stringify(userData));
      } else {
        toast.error("Registration failed. Please try again.");
      }
    } catch (error) {
      console.error("Error in registerOrLogin:", error);
      toast.error("Login failed. Please try again.");
    }
  };

  return (
    <TelegramAuthContext.Provider
      value={{
        userInfo,
        isLoading,
        registerOrLogin,
        updateUserInfo,
        fetchUserInfo,
      }}>
      {children}
      <ToastContainer />
    </TelegramAuthContext.Provider>
  );
}

export function useTelegramAuth() {
  return useContext(TelegramAuthContext);
}
