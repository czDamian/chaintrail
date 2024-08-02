import { useState, useEffect } from "react";
import Popup from "../HomePage/Popup";
import Button from "../Reusable/Button";
import { ethers } from "ethers";
import { useTelegramAuth } from "@/app/TelegramAuthProvider";
import { FaCheckCircle } from "react-icons/fa";

export default function Profile() {
  const { userInfo, isLoading } = useTelegramAuth();
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [walletAddress, setWalletAddress] = useState("");
  const [isWalletConnected, setIsWalletConnected] = useState(false);

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
        alert("Please install MetaMask!");
      }
    } catch (error) {
      console.error("Error connecting to wallet:", error);
    }
  };

  const trimWalletAddress = (address) => {
    return `${address.slice(0, 5)}...${address.slice(-4)}`;
  };

  useEffect(() => {
    if (walletAddress) {
      setIsWalletConnected(true);
    }
  }, [walletAddress]);

  return (
    <div className="text-xs font-raleway">
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
    </div>
  );
}
