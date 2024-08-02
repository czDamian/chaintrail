import { useState, useEffect } from "react";
import Popup from "../HomePage/Popup";
import Button from "../Reusable/Button";
import { ethers } from "ethers";
import { useTelegramAuth } from "@/app/TelegramAuthProvider";
import { FaCheckCircle } from "react-icons/fa";
import { IoCopy } from "react-icons/io5";
import { CgClose } from "react-icons/cg";

export default function Profile() {
  const { userInfo, isLoading } = useTelegramAuth();
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [walletAddress, setWalletAddress] = useState("");
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  const [showInstallMetamaskPopup, setShowInstallMetamaskPopup] =
    useState(false);
  const [copyButtonText, setCopyButtonText] = useState("Copy Link");

  const openPopup = () => setIsPopupOpen(true);
  const closePopup = () => setIsPopupOpen(false);

  const handleWalletConnect = async () => {
    try {
      if (window.ethereum) {
        const web3Provider = new ethers.BrowserProvider(window.ethereum);
        await web3Provider.send("eth_requestAccounts", []);
        const walletSigner = await web3Provider.getSigner();
        const address = await walletSigner.getAddress();
        setWalletAddress(address);
        setIsWalletConnected(true);
        closePopup();
      } else {
        setShowInstallMetamaskPopup(true);
      }
    } catch (error) {
      console.error("Error connecting to wallet:", error);
    }
  };

  const trimWalletAddress = (address) => {
    return `${address.slice(0, 5)}...${address.slice(-4)}`;
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText("https://chaintrail.vercel.app");
    setCopyButtonText("Copied");
    setTimeout(() => setCopyButtonText("Copy Link"), 2000);
  };

  useEffect(() => {
    if (walletAddress) {
      setIsWalletConnected(true);
    }
  }, [walletAddress]);

  return (
    <div className="text-xs md:text-lg font-raleway">
      {!isWalletConnected && !isLoading && userInfo ? (
        <p className="text-gold-500">
          Hi, {userInfo.username || userInfo.first_name}!
        </p>
      ) : isWalletConnected ? (
        <p className="text-gold-500 flex gap-1 items-center">
          <FaCheckCircle className="text-green-500" />
          {trimWalletAddress(walletAddress)}
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
              Copy this link and open in your MetaMask
            </p>
            <div className="flex justify-center">
              <Button
                onClick={handleCopyLink}
                className="flex items-center gap-1 border hover:border-gold-500 text-xs mb-8">
                <IoCopy /> {copyButtonText}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
