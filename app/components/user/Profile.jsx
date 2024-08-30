"use client";
import { useState, useEffect } from "react";
import { useAuth } from "@/app/AuthenticationProvider";
import Button from "../Reusable/Button";
import { FaCheckCircle } from "react-icons/fa";
import Logout from "./Logout";
import { useRouter } from "next/navigation";
import { CgClose } from "react-icons/cg";
import RainbowWallet from "@/app/wallet/ConnectButton";

// Function to check if the user is on a mobile device
const isMobileDevice = () => {
  return /Mobi|Android/i.test(navigator.userAgent);
};

export default function Profile() {
  const router = useRouter();
  const { userInfo, logout, handleWalletConnect, isLoading } = useAuth();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isWalletPopupOpen, setIsWalletPopupOpen] = useState(false);
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const telegramWebAppDefined = window.Telegram?.WebApp;
      const isMobile = isMobileDevice();

      // Show content if on mobile device and Telegram Web App is defined
      setShowContent(isMobile && telegramWebAppDefined);
    }
  }, []);

  const trimWalletAddress = (address) => {
    return address ? `${address.slice(0, 4)}...${address.slice(-3)}` : "";
  };

  const handleLogout = async () => {
    await logout();
    localStorage.removeItem("userId");
    router.push("/");
  };

  const openWalletPopup = () => setIsWalletPopupOpen(true);
  const closeWalletPopup = () => setIsWalletPopupOpen(false);

  // Display RainbowWallet if conditions are not met
  if (!showContent) {
    return <RainbowWallet />;
  }

  return (
    <div className="text-xs md:text-lg font-raleway relative">
      {userInfo ? (
        <>
          <p
            className="text-gold-500 flex gap-1 items-center cursor-pointer"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}>
            <FaCheckCircle className="text-green-500" />
            {userInfo.username ||
              trimWalletAddress(userInfo.walletAddress) ||
              trimWalletAddress(userInfo.userId)}
          </p>
          {isDropdownOpen && (
            <Logout
              onLogout={handleLogout}
              onClose={() => setIsDropdownOpen(false)}
            />
          )}
        </>
      ) : (
        <>
          <Button
            onClick={openWalletPopup}
            className="border border-white bg-black hover:border-gold-500 text-xs animate-bounce-in-down focus:outline-none">
            {isLoading ? "Connecting" : "CONNECT"}
          </Button>

          {isWalletPopupOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
              <div className="bg-slate-950 rounded-lg shadow-xl w-80">
                <div className="p-4">
                  <div className="flex justify-end">
                    <button
                      onClick={closeWalletPopup}
                      className="text-gray-500 my-2 p-1 hover:text-gray-700 text-lg">
                      <CgClose />
                    </button>
                  </div>
                  <div className="space-y-4 py-2 text-lg">
                    <div
                      onClick={() => {
                        closeWalletPopup();
                        handleWalletConnect();
                      }}
                      className="flex items-center justify-between px-2 py-4 hover:bg-slate-900 rounded cursor-pointer">
                      <p>Connect MetaMask</p>
                      <img
                        src="metamask.svg"
                        alt="metamask"
                        width={30}
                        height={30}
                      />
                    </div>
                    <div
                      onClick={() => {
                        closeWalletPopup();
                        handleWalletConnect();
                      }}
                      className="flex items-center justify-between px-2 py-4 hover:bg-slate-900 rounded cursor-pointer">
                      <p>Wallet Connect</p>
                      <img
                        src="metamask.svg"
                        alt="metamask"
                        width={30}
                        height={30}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
