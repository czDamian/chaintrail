"use client";
import { useState, useEffect } from "react";
import { useTelegramAuth } from "@/app/TelegramAuthProvider";
import { ethers } from "ethers";
import { FaCheckCircle } from "react-icons/fa";
import { CgClose } from "react-icons/cg";
import Button from "../Reusable/Button";
import Image from "next/image";
import Link from "next/link";
import Toast from "../Reusable/Toast";

export default function Profile() {
  const { userInfo, registerUser, fetchUserInfo } = useTelegramAuth();
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [walletAddress, setWalletAddress] = useState("");
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  const [showInstallMetamaskToast, setShowInstallMetamaskToast] =
    useState(false);
  const [isDesktop, setIsDesktop] = useState(true);

  const openPopup = () => setIsPopupOpen(true);
  const closePopup = () => setIsPopupOpen(false);

  useEffect(() => {
    const savedUserId = localStorage.getItem("userId");
    if (savedUserId) {
      setWalletAddress(savedUserId);
      setIsWalletConnected(true);
      fetchUserInfo(savedUserId);
    }
      console.log("Your saved id is", savedUserId);


    const userAgent = navigator.userAgent || navigator.vendor || window.opera;
    const isMobile = /android|ipad|iphone|ipod|opera mini|mobile/i.test(
      userAgent
    );
    setIsDesktop(!isMobile);
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
        setShowInstallMetamaskToast(true);
        setTimeout(() => setShowInstallMetamaskToast(false), 2000); // Hide after 2 seconds
      }
    } catch (error) {
      console.error("Error connecting to wallet:", error);
    }
  };

  const trimWalletAddress = (address) => {
    return address ? `${address.slice(0, 4)}...${address.slice(-3)}` : "";
  };
  console.log("Your id is", userInfo?.userId);
  console.log("Your trimmed id is", trimWalletAddress(userInfo?.userId));
  console.log("Your username is", userInfo?.username);

  return (
    <div className="text-xs md:text-lg font-raleway">
      {userInfo ? (
        <p className="text-gold-500 flex gap-1 items-center">
          <FaCheckCircle className="text-green-500" />
          {userInfo.username || trimWalletAddress(userInfo.userId)}
        </p>
      ) : (
        <Button
          onClick={openPopup}
          className="border border-white bg-black hover:border-gold-500 text-xs animate-bounce-in-down focus:outline-none">
          CONNECT
        </Button>
      )}

      {isPopupOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-slate-950 rounded-lg shadow-xl w-80">
            <div className="p-4">
              <div className="flex justify-end">
                <button
                  onClick={closePopup}
                  className="text-gray-500 my-2 p-1 hover:text-gray-700 text-lg">
                  <CgClose />
                </button>
              </div>

              <div className="space-y-4 py-2 text-lg">
                {isDesktop && (
                  <div
                    onClick={handleWalletConnect}
                    className="flex items-center justify-between px-2 py-4 hover:bg-slate-900 rounded">
                    <p>Connect Wallet</p>
                    <Image
                      src="metamask.svg"
                      width={30}
                      height={30}
                      alt="metamask"
                    />
                  </div>
                )}
                <Link
                  href="https://t.me/ChainTrailBot"
                  className="flex items-center justify-between px-2 py-4 hover:bg-slate-900 rounded">
                  <p>Play on Telegram</p>
                  <Image
                    src="telegram.svg"
                    width={30}
                    height={30}
                    alt="telegram"
                  />
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {showInstallMetamaskToast && (
        <Toast
          message="Please install MetaMask extension!"
          borderLeftColor="border-l-red-500"
          className=""
        />
      )}
    </div>
  );
}
