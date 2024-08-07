"use client";
import { useContext, useEffect, useState, createContext } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const TelegramAuthContext = createContext();

export default function TelegramAuthProvider({ children }) {
  const [userInfo, setUserInfo] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [userPoints, setUserPoints] = useState(0);
  const [registrationStatus, setRegistrationStatus] = useState("");

  useEffect(() => {
    // Load userInfo from local storage
    const savedUserInfo = localStorage.getItem("userInfo");
    if (savedUserInfo) {
      setUserInfo(JSON.parse(savedUserInfo));
      setIsLoading(false);
    } else {
      // Load Telegram script and initialize Telegram Web App
      const script = document.createElement("script");
      script.src = "https://telegram.org/js/telegram-web-app.js";
      script.async = true;
      script.onload = () => {
        window.Telegram.WebApp.ready();
        const user = window.Telegram.WebApp.initDataUnsafe.user;
        if (user && user.id) {
          setUserInfo(user);
          localStorage.setItem("userInfo", JSON.stringify(user)); // Save userInfo to local storage
          registerOrLogin(user.id, user.username || "");
        }
        setIsLoading(false);
      };
      document.body.appendChild(script);

      return () => {
        document.body.removeChild(script);
      };
    }
  }, []);

  const registerOrLogin = async (userId, username) => {
    try {
      const response = await fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId, username }),
      });
      const data = await response.json();
      setRegistrationStatus(data.message);
      if (response.ok) {
        setUserPoints(1000);
        toast.success("Registration successful!");
      } else {
        toast.error("Registration failed. Please try again.");
      }
    } catch (error) {
      console.error("Error registering or logging in user:", error);
      toast.error("Registration or login failed. Please try again.");
    }
  };

  return (
    <TelegramAuthContext.Provider value={{ userInfo, isLoading, userPoints }}>
      {children}
      <ToastContainer />
    </TelegramAuthContext.Provider>
  );
}

export function useTelegramAuth() {
  return useContext(TelegramAuthContext);
}
