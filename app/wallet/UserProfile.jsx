"use client";
import { useState, useEffect } from "react";
import { useTelegramAuth } from "@/app/TelegramAuthProvider";
import {
  FaEye,
  FaTimes,
  FaEyeSlash,
  FaCheckCircle,
  FaChevronDown,
} from "react-icons/fa";
import { format } from "date-fns";
import { ethers } from "ethers";
import Modal from "../components/Reusable/Modal";
import Loader from "../loader";
import { useRouter } from "next/navigation";

export default function UserProfile() {
  const { userInfo, isLoading, fetchUserInfo } = useTelegramAuth();
  const [seedPhrase, setSeedPhrase] = useState(Array(12).fill(""));
  const [importError, setImportError] = useState("");
  const [importSuccess, setImportSuccess] = useState(false);
  const [showImportFields, setShowImportFields] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showPrivateKeyModal, setShowPrivateKeyModal] = useState(false);
  const router = useRouter();

  const truncateAddress = (address) => {
    return address ? `${address.slice(0, 6)}...${address.slice(-4)}` : "";
  };

  useEffect(() => {
    const savedUserId = localStorage.getItem("userId");
    if (savedUserId && (!userInfo || userInfo.userId !== savedUserId)) {
      fetchUserInfo(savedUserId);
    }
  }, [fetchUserInfo, userInfo]);

  if (isLoading || !userInfo || !userInfo.userId) {
    return <Loader />;
  }

  const formattedDate = format(new Date(userInfo.createdAt), "MMMM dd, yyyy");

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

      router.refresh();
    } catch (err) {
      console.error("Error disconnecting wallet:", err);
      setImportError("Failed to disconnect wallet");
    }
  };

  const handleSeedPhraseChange = (index, value) => {
    const updatedSeedPhrase = [...seedPhrase];
    updatedSeedPhrase[index] = value;
    setSeedPhrase(updatedSeedPhrase);

    if (index === 0) {
      const words = value.trim().split(/\s+/);
      if (words.length === 12) {
        for (let i = 0; i < words.length; i++) {
          if (i < seedPhrase.length) {
            updatedSeedPhrase[i] = words[i];
          }
        }
        setSeedPhrase(updatedSeedPhrase);
      }
    }
  };

  const handleImportWallet = async () => {
    if (!seedPhrase.every(Boolean)) {
      setImportError("All seed phrase fields must be filled");
      return;
    }

    try {
      const mnemonic = seedPhrase.join(" ");
      const walletInstance = ethers.Wallet.fromPhrase(mnemonic);

      const response = await fetch(`/api/users?userId=${userInfo.userId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          walletAddress: walletInstance.address,
          privateKey: walletInstance.privateKey,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update user wallet info");
      }

      setImportSuccess(true);
      setImportError("");
      fetchUserInfo(userInfo.userId);
      router.refresh();
    } catch (err) {
      console.error("Error importing wallet:", err);
      setImportError("Failed to import wallet");
      setImportSuccess(false);
    }
  };

  return (
    <div className="hover:animate-background rounded-xl bg-gradient-to-r from-green-300 via-blue-500 to-purple-600 p-0.5 shadow-xl transition hover:bg-[length:400%_400%] hover:shadow-sm hover:[animation-duration:_4s] dark:shadow-gray-700/25 mt-20 mx-8">
      <div className="flex flex-col items-center rounded-[10px] p-4 bg-gray-900">
        <div className="w-full max-w-4xl p-6 ">
          <div className="mb-6 flex items-center gap-2 text-gold-500">
            <h2 className="text-2xl font-semibold">My Profile</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <p>
              <span className="font-bold">Username:</span>
              {userInfo.username || " not set"}
            </p>
            <p>
              <span className="font-bold">Points:</span> {userInfo.points}
            </p>
            <p>
              <span className="font-bold">Play Pass: </span>
              {userInfo.playPass}
            </p>

            {userInfo.walletAddress && userInfo.privateKey ? (
              <>
                <div className="flex flex-col xs:flex-row justify-between gap-2">
                  <button
                    onClick={() => setShowModal(true)}
                    className="flex items-center gap-2 text-blue-500 border p-2 rounded-md border-blue-500 text-sm">
                    {truncateAddress(userInfo.walletAddress)}
                    <FaChevronDown />
                  </button>
                  <button className="flex items-center gap-2  border p-2 rounded-md border-blue-500">
                    <img
                      src="https://www.opencampus.xyz/static/media/coin-logo.39cbd6c42530e57817a5b98ac7621ca7.svg"
                      alt="Chain Logo"
                      className="w-6 h-6"
                    />
                    <span className="text-gray-400 text-sm">Edu Chain</span>
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
                      <p className="text-center text-gray-400 my-4">0 ETH</p>
                      <div className="flex text-sm justify-between gap-4">
                        <button
                          onClick={handleDisconnect}
                          className="bg-red-500 text-white px-2 py-3 rounded-md">
                          Disconnect
                        </button>
                        <button
                          onClick={() => setShowPrivateKeyModal(true)}
                          className="bg-blue-500 text-white px-2 py-3 rounded-md">
                          Show Private Key
                        </button>
                      </div>
                    </div>
                  </Modal>
                )}

                {showPrivateKeyModal && (
                  <Modal
                    isOpen={showPrivateKeyModal}
                    onClose={() => setShowPrivateKeyModal(false)}>
                    <h3 className="text-lg font-semibold mb-4">Private Key</h3>
                    <input
                      type="text"
                      value={userInfo.privateKey}
                      readOnly
                      className="w-full px-3 py-2 border rounded-md bg-gray-900"
                    />
                    <div className="flex justify-end mt-4">
                      <button
                        onClick={() => setShowPrivateKeyModal(false)}
                        className="bg-gray-500 text-white px-4 py-2 rounded-md">
                        Close
                      </button>
                    </div>
                  </Modal>
                )}
              </>
            ) : (
              <div className="col-span-2">
                {!showImportFields ? (
                  <button
                    onClick={() => setShowImportFields(true)}
                    className="bg-blue-500 text-white px-4 py-2 rounded-md mt-4 w-full">
                    Connect Wallet
                  </button>
                ) : (
                  <>
                    <h3 className="text-xl font-bold mb-4">Import Wallet</h3>
                    <div className="grid grid-cols-3 gap-2">
                      {seedPhrase.map((word, index) => (
                        <input
                          key={index}
                          type="text"
                          value={word}
                          onChange={(e) =>
                            handleSeedPhraseChange(index, e.target.value)
                          }
                          className="border rounded-md px-2 py-1 text-sm"
                          placeholder={`Word ${index + 1}`}
                        />
                      ))}
                    </div>
                    <button
                      onClick={handleImportWallet}
                      className="bg-blue-500 text-white px-4 py-2 rounded-md mt-4 w-full">
                      Import Wallet
                    </button>
                    {importSuccess && (
                      <div className="flex items-center mt-2 text-green-600">
                        <FaCheckCircle className="mr-2" />
                        <p>Wallet imported successfully!</p>
                      </div>
                    )}
                    {importError && (
                      <div className="text-sm text-red-600 mt-2">
                        <p>{importError}</p>
                      </div>
                    )}
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
