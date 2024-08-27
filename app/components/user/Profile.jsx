"use client";
import { useState, useCallback, useEffect } from "react";
import { useTelegramAuth } from "@/app/TelegramAuthProvider";
import Button from "../Reusable/Button";
import { FaCheckCircle } from "react-icons/fa";
import ConnectWalletPopup from "../HomePage/ConnectWalletPopup";
import Logout from "./Logout";
import { useRouter } from "next/navigation";

export default function Profile() {
  const router = useRouter();
  const { userInfo, fetchUserInfo, logout } = useTelegramAuth();
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isDesktop, setIsDesktop] = useState(true);

  const trimWalletAddress = (address) => {
    return address ? `${address.slice(0, 4)}...${address.slice(-3)}` : "";
  };

  const openPopup = () => setIsPopupOpen(true);
  const closePopup = () => setIsPopupOpen(false);

  const handleAccountConnected = useCallback(async () => {
    const savedUserId = localStorage.getItem("userId");
    if (savedUserId) {
      await fetchUserInfo(savedUserId);
    }
  }, [fetchUserInfo]);

  const handleLogout = async () => {
    await logout();
    localStorage.removeItem("userId");
    router.push("/");
  };

  useEffect(() => {
    const userAgent = navigator.userAgent || window.opera;
    const isMobile =
      /android|iPhone|iPad|iPod|opera mini|IEMobile|WPDesktop/i.test(userAgent);
    setIsDesktop(!isMobile);
  }, []);

  return (
    <div className="text-xs md:text-lg font-raleway relative">
      {userInfo ? (
        <>
          <p
            className="text-gold-500 flex gap-1 items-center cursor-pointer"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          >
            <FaCheckCircle className="text-green-500" />
            {userInfo.username || trimWalletAddress(userInfo.userId)}
          </p>
          {isDropdownOpen && (
            <Logout
              onLogout={handleLogout}
              onClose={() => setIsDropdownOpen(false)}
            />
          )}
        </>
      ) : (
        <Button
          onClick={openPopup}
          className="border border-white bg-black hover:border-gold-500 text-xs animate-bounce-in-down focus:outline-none">
          CONNECT
        </Button>
      )}

      <ConnectWalletPopup
        isOpen={isPopupOpen}
        onClose={closePopup}
        onAccountConnected={handleAccountConnected}
      />
    </div>
  );
}
