"use client";
import { useState } from "react";
import { ethers } from "ethers";
import { CgClose } from "react-icons/cg";
import Toast from "../Reusable/Toast";

export default function ConnectWalletPopup({
  isOpen,
  onClose,
  onAccountConnected,
}) {
  const [showInstallMetamaskToast, setShowInstallMetamaskToast] =
    useState(false);

  const handleWalletConnect = async () => {
    try {
      if (window.ethereum) {
        const web3Provider = new ethers.BrowserProvider(window.ethereum);
        await web3Provider.send("eth_requestAccounts", []);
        const walletSigner = await web3Provider.getSigner();
        const address = await walletSigner.getAddress();

        if (address) {
          localStorage.setItem("userId", address);
          onClose();
          await onAccountConnected();
        } else {
          console.error("Failed to get wallet address");
        }
      } else {
        setShowInstallMetamaskToast(true);
        setTimeout(() => setShowInstallMetamaskToast(false), 2000);
      }
    } catch (error) {
      console.error("Error connecting to wallet:", error);
    }
  };

  return (
    isOpen && (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
        <div className="bg-slate-950 rounded-lg shadow-xl w-80">
          <div className="p-4">
            <div className="flex justify-end">
              <button
                onClick={onClose}
                className="text-gray-500 my-2 p-1 hover:text-gray-700 text-lg">
                <CgClose />
              </button>
            </div>

            <div className="space-y-4 py-2 text-lg">
              <div
                onClick={handleWalletConnect}
                className="flex items-center justify-between px-2 py-4 hover:bg-slate-900 rounded">
                <p>Connect Wallet</p>
                <img src="metamask.svg" alt="metamask" width={30} height={30} />
              </div>
            </div>
          </div>
        </div>
        {showInstallMetamaskToast && (
          <Toast
            message="Please install MetaMask extension!"
            borderLeftColor="border-l-red-500"
          />
        )}
      </div>
    )
  );
}
