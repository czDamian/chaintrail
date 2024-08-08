"use client";
import { useState, useEffect } from "react";
import { useTelegramAuth } from "@/app/TelegramAuthProvider";
import { ethers } from "ethers";
import { FaCheckCircle } from "react-icons/fa";
import { CgClose } from "react-icons/cg";
import Popup from "../HomePage/Popup";
import Button from "../Reusable/Button";

export default function Profile() {
  const { userInfo, registerUser, fetchUserInfo, isLoading } =
    useTelegramAuth();
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [walletAddress, setWalletAddress] = useState("");
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  const [showInstallMetamaskPopup, setShowInstallMetamaskPopup] =
    useState(false);

  const openPopup = () => setIsPopupOpen(true);
  const closePopup = () => setIsPopupOpen(false);

  useEffect(() => {
    const savedUserId = localStorage.getItem("userId");
    if (savedUserId) {
      if (savedUserId.startsWith("0x")) {
        setWalletAddress(savedUserId);
        setIsWalletConnected(true);
      }
      fetchUserInfo(savedUserId);
    }
  }, []);

  const handleWalletConnect = async () => {
    try {
      if (window.ethereum) {
        const web3Provider = new ethers.BrowserProvider(window.ethereum);
        await web3Provider.send("eth_requestAccounts", []);
        const walletSigner = await web3Provider.getSigner();
        const address = await walletSigner.getAddress();

        if (address) {
          setWalletAddress(address);
          setIsWalletConnected(true);
          localStorage.setItem("userId", address);
          closePopup();

          await registerUser(address, "", "wallet");
        } else {
          console.error("Failed to get wallet address");
        }
      } else {
        setShowInstallMetamaskPopup(true);
      }
    } catch (error) {
      console.error("Error connecting to wallet:", error);
    }
  };

  const trimWalletAddress = (address) => {
    return address ? `${address.slice(0, 4)}...${address.slice(-3)}` : "";
  };

  if (isLoading) {
    return (
      <Button className="border border-white bg-black hover:border-gold-500 text-xs">
        CONNECT
      </Button>
    );
  }

  return (
    <div className="text-xs md:text-lg font-raleway">
      {userInfo ? (
        <p className="text-gold-500 flex gap-1 items-center">
          <FaCheckCircle className="text-green-500" />
          {userInfo.username || trimWalletAddress(userInfo.userId)}
        </p>
      ) : (
        <div
          onClick={openPopup}
          className="animate-bounce-in-down focus:outline-none">
          <Button className="border border-white bg-black hover:border-gold-500 text-xs">
            CONNECT
          </Button>
        </div>
      )}
      <Popup
        isOpen={isPopupOpen}
        onClose={closePopup}
        connectWallet={handleWalletConnect}
      />

      {showInstallMetamaskPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-slate-950 rounded-lg shadow-xl p-4 w-80 relative">
            <button
              onClick={() => setShowInstallMetamaskPopup(false)}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700">
              <CgClose className="text-lg" />
            </button>
            <p className="text-white mt-8 text-center mb-4">
              Please install MetaMask extension!
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
