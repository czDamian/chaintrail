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
    const savedUserInfo = localStorage.getItem("userInfo");
    console.log("Saved userInfo in local storage:", savedUserInfo);
    if (savedUserInfo) {
      setUserInfo(JSON.parse(savedUserInfo));
    }
    setIsLoading(false);
  }, []);

  const updateUserInfo = (newUserInfo) => {
    setUserInfo(newUserInfo);
    localStorage.setItem("userInfo", JSON.stringify(newUserInfo));
    console.log("Updated userInfo:", newUserInfo);
  };

  const registerOrLogin = async (userId, username) => {
    try {
      // Simulating API call
      const newUserInfo = { id: userId, username, role: "user" };
      updateUserInfo(newUserInfo);
    } catch (error) {
      console.error("Error in registerOrLogin:", error);
      toast.error("Login failed. Please try again.");
    }
  };

  return (
    <TelegramAuthContext.Provider
      value={{ userInfo, isLoading, registerOrLogin, updateUserInfo }}>
      {children}
      <ToastContainer />
    </TelegramAuthContext.Provider>
  );
}

export function useTelegramAuth() {
  return useContext(TelegramAuthContext);
}
