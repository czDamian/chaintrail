"use client";
import { useState, useEffect, createContext, useContext } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const TelegramAuthContext = createContext();

export default function TelegramAuthProvider({ children }) {
  const [userInfo, setUserInfo] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [userPoints, setUserPoints] = useState(0);

  useEffect(() => {
    if (window.Telegram?.WebApp) {
      const user = window.Telegram.WebApp.initDataUnsafe?.user;
      const queryString = window.Telegram.WebApp.initData || "";
      const urlParams = new URLSearchParams(queryString);
      const referralCode = urlParams.get("start"); // Extract referral code from URL
      const app = window.Telegram.WebApp;
      app.ready();
      app.expand();
      app.enableClosingConfirmation();

      if (referralCode) {
        localStorage.setItem("referralCode", referralCode);
      }

      if (user && user.id) {
        registerUser(user.id.toString(), user.username || "", "telegram");
      }
    }
  }, []);

  const fetchUserInfo = async (userId) => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/users?userId=${userId}`);
      if (response.ok) {
        const userData = await response.json();
        setUserInfo(userData);
        setUserPoints(userData.points || 0);
      } else {
        console.error("Failed to fetch user data");
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const registerUser = async (userId, username, method) => {
    const referralCode = localStorage.getItem("referralCode");

    try {
      setIsLoading(true);
      const response = await fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId, username, method, referralCode }),
      });
      const data = await response.json();
      if (response.ok) {
        setUserInfo(data);
        setUserPoints(data.points || 0);
        localStorage.setItem("userId", userId);
        localStorage.removeItem("referralCode");
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
        updatePoints,
        fetchUserInfo,
        registerUser,
      }}>
      {children}
      <ToastContainer />
    </TelegramAuthContext.Provider>
  );
}

export function useTelegramAuth() {
  return useContext(TelegramAuthContext);
}
