import { useState, useEffect } from "react";
import { FaChevronDown, FaTimes, FaCopy, FaWallet } from "react-icons/fa";
import Modal from "../components/Reusable/Modal";
import Web3 from "web3";

export default function ConnectedWallet({ userInfo }) {
  const [showModal, setShowModal] = useState(false);
  const [balance, setBalance] = useState("0.000");

  const truncateAddress = (address) => {
    return address ? `${address.slice(0, 4)}...${address.slice(-4)}` : "";
  };

  const checkBalance = async () => {
    try {
      const web3 = new Web3("https://open-campus-codex-sepolia.drpc.org");
      const balanceWei = await web3.eth.getBalance(userInfo.walletAddress);
      const balanceEDU = web3.utils.fromWei(balanceWei, "ether");
      setBalance(parseFloat(balanceEDU).toFixed(3));
    } catch (error) {
      console.error("Error fetching balance:", error);
      setBalance("Error");
    }
  };

  useEffect(() => {
    if (userInfo.walletAddress) {
      checkBalance();
    }
  }, [userInfo.walletAddress]);

  const handleDisconnect = async () => {
    try {
      const response = await fetch(`/api/users?userId=${userInfo.userId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          walletAddress: null,
          privateKey: null,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to disconnect wallet");
      }

      window.location.reload();
    } catch (err) {
      console.error("Error disconnecting wallet:", err);
    }
  };

  const copyAddressToClipboard = () => {
    navigator.clipboard
      .writeText(userInfo.walletAddress)
      .then(() => alert("Address copied to clipboard"))
      .catch((err) => console.error("Failed to copy address:", err));
  };

  return (
    <>
      <div className="flex flex-col xs:flex-row flex-wrap justify-between gap-2">
        <button className="flex items-center gap-2 border p-2 rounded-md border-blue-500">
          <img
            src="https://www.opencampus.xyz/static/media/coin-logo.39cbd6c42530e57817a5b98ac7621ca7.svg"
            alt="Chain Logo"
            className="w-6 h-6"
          />
          <span className="text-gray-400 text-sm">Edu Chain</span>
        </button>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 text-blue-500 border p-2 rounded-md border-blue-500 text-sm">
          <span className="text-gray-300">{balance} EDU</span>
          <span>{truncateAddress(userInfo.walletAddress)}</span>
          <FaChevronDown />
        </button>
      </div>

      {showModal && (
        <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
          <div className="relative">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700">
              <FaTimes />
            </button>
            <p className="text-center font-bold my-4">
              {truncateAddress(userInfo.walletAddress)}
            </p>
            <p className="text-center text-sm text-gray-500 my-4">
              {balance} EDU
            </p>
            <div className="flex text-sm justify-between gap-4">
              <button
                onClick={copyAddressToClipboard}
                className="bg-slate-900 text-white border border-transparent active:border-gray-400 w-full py-3 rounded-md flex flex-col items-center">
                <FaCopy />
                <span>Copy Address</span>
              </button>
              <button
                onClick={handleDisconnect}
                className="bg-slate-900 text-white border border-transparent active:border-gray-400 w-full py-3 rounded-md flex flex-col items-center">
                <FaWallet />
                <span>Disconnect</span>
              </button>
            </div>
          </div>
        </Modal>
      )}
    </>
  );
}
