"use client";
import { useState, useEffect, createContext, useContext } from "react";
import { useRouter } from "next/navigation";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const TelegramAuthContext = createContext();

export default function TelegramAuthProvider({ children }) {
  const [userInfo, setUserInfo] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [userPoints, setUserPoints] = useState(0);
  const [registrationStatus, setRegistrationStatus] = useState("");
  const router = useRouter();

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://telegram.org/js/telegram-web-app.js";
    script.async = true;
    script.onload = () => {
      window.Telegram.WebApp.ready();
      const user = window.Telegram.WebApp.initDataUnsafe.user;
      if (user && user.id) {
        setUserInfo(user);
        registerUser(user.id, user.username || "");
      } else {
        const savedUserId = localStorage.getItem("userId");
        if (savedUserId) {
          fetchUserInfo(savedUserId);
        } else {
          setIsLoading(false);
        }
      }
    };
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const fetchUserInfo = async (userId) => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/users?userId=${userId}`);
      if (response.ok) {
        const userData = await response.json();
        setUserInfo(userData);
        setUserPoints(userData.points || 0);
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
        setUserPoints(updatedUser.points || 0);
        localStorage.setItem("userInfo", JSON.stringify(updatedUser));
        console.log("Updated userInfo:", updatedUser);
      } else {
        console.error("Failed to update user data");
      }
    } catch (error) {
      console.error("Error updating user data:", error);
    }
  };

  const registerUser = async (userId, username) => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId, username }),
      });
      const data = await response.json();
      if (response.ok) {
        setUserInfo(data);
        setUserPoints(data.points || 0);
        setRegistrationStatus(data.message);
        localStorage.setItem("userId", userId);
        localStorage.setItem("userInfo", JSON.stringify(data));
      } else {
        toast.error("Registration failed. Please try again.");
      }
    } catch (error) {
      console.error("Error registering user:", error);
      toast.error("Registration failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const updatePoints = async (increment) => {
    setUserPoints((prevPoints) => prevPoints + increment);

    try {
      const response = await fetch("/api/points", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId: userInfo.id, increment }),
      });

      if (!response.ok) {
        throw new Error("Failed to update points on the server");
      }

      const data = await response.json();
      console.log("Points updated successfully on the server:", data);
    } catch (error) {
      console.error("Error updating points:", error.message, error.stack);
      setUserPoints((prevPoints) => prevPoints - increment);
    }
  };

  return (
    <TelegramAuthContext.Provider
      value={{
        userInfo,
        isLoading,
        userPoints,
        registrationStatus,
        updatePoints,
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
