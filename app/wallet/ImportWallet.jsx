"use client";
import { useState, useEffect, useRef } from "react";
import { ethers } from "ethers";
import { FaCheckCircle, FaTimes } from "react-icons/fa";
import WalletOptions from "./WalletOptions";
import WalletDetails from "./WalletDetails";

const ImportWallet = () => {
  const [importOption, setImportOption] = useState("12words");
  const [seedPhrase, setSeedPhrase] = useState(Array(12).fill(""));
  const [wallet, setWallet] = useState(null);
  const [chainName, setChainName] = useState("");
  const [balance, setBalance] = useState(null);
  const [selectedNetwork, setSelectedNetwork] = useState(
    "https://rpc.sepolia.org"
  );
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [showNetworkModal, setShowNetworkModal] = useState(false);
  const [showDisconnectModal, setShowDisconnectModal] = useState(false);
  const networkModalRef = useRef(null);
  const disconnectModalRef = useRef(null);

  useEffect(() => {
    const fetchWalletDetails = async () => {
      if (wallet) {
        try {
          const provider = new ethers.JsonRpcProvider(selectedNetwork);
          const balance = await provider.getBalance(wallet.address);
          const network = await provider.getNetwork();
          setChainName(network.name);
          setBalance(ethers.formatEther(balance));
        } catch (err) {
          console.error("Error fetching wallet details:", err);
        }
      }
    };

    fetchWalletDetails();
  }, [wallet, selectedNetwork]);

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

  const connectWallet = async () => {
    try {
      if (importOption === "12words" && seedPhrase.every(Boolean)) {
        const mnemonic = seedPhrase.join(" ");
        const walletInstance = ethers.Wallet.fromPhrase(mnemonic);
        setWallet(walletInstance);
        setSuccess(true);
        setError("");
        console.log("Private Key:", walletInstance.privateKey);
      } else {
        setError("Fields cannot be empty");
        setSuccess(false);
      }
    } catch (err) {
      console.error("Error connecting wallet:", err);
      setError("Failed to import wallet");
      setSuccess(false);
    }
  };

  const handleDisconnect = () => {
    setWallet(null);
    setChainName("");
    setBalance(null);
    setShowDisconnectModal(false);
  };

  const closeModal = (event, ref, setModalState) => {
    if (ref.current && !ref.current.contains(event.target)) {
      setModalState(false);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      closeModal(event, networkModalRef, setShowNetworkModal);
      closeModal(event, disconnectModalRef, setShowDisconnectModal);
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="flex flex-col items-center space-y-4 mt-10">
      {wallet ? (
        <>
          <WalletDetails
            walletAddress={wallet.address}
            chainName={chainName}
            balance={balance}
            setSelectedNetwork={setSelectedNetwork}
            handleDisconnect={() => setShowDisconnectModal(true)}
            setShowNetworkModal={setShowNetworkModal}
          />
          {showNetworkModal && (
            <div
              className="fixed inset-0 bg-gray-950 bg-opacity-80 shadow-xl flex items-center justify-center`"
              ref={networkModalRef}>
              <div className="bg-gray-900 px-6 py-8 rounded-md relative w-60 mx-auto border border-gray-600 bottom-28 left-20">
                <FaTimes
                  onClick={() => setShowNetworkModal(false)}
                  className="absolute top-2 right-2 cursor-pointer"
                />
                <h2 className="text-lg font-semibold">Switch Network</h2>
                <ul className="mt-4">
                  <li
                    className="cursor-pointer mb-2"
                    onClick={() => {
                      setSelectedNetwork(
                        "https://eth-mainnet.public.blastapi.io"
                      );
                      setShowNetworkModal(false);
                    }}>
                    Ethereum Mainnet
                  </li>
                  <li
                    className="cursor-pointer"
                    onClick={() => {
                      setSelectedNetwork("https://rpc.sepolia.org");
                      setShowNetworkModal(false);
                    }}>
                    Sepolia Testnet
                  </li>
                </ul>
              </div>
            </div>
          )}
          {showDisconnectModal && (
            <div
              className="fixed inset-0 bg-gray-950 bg-opacity-80 shadow-xl flex items-center justify-center"
              ref={disconnectModalRef}>
              <div className="bg-gray-900 px-6 py-8 rounded-md relative w-60 text-center mx-auto border border-gray-600 bottom-28 right-20">
                <FaTimes
                  onClick={() => setShowDisconnectModal(false)}
                  className="absolute top-2 right-2 cursor-pointer"
                />
                <h2 className="text-lg font-semibold">Disconnect Wallet</h2>
                <button
                  onClick={handleDisconnect}
                  className="bg-red-500 text-white px-4 py-2 rounded-md mt-4">
                  Disconnect
                </button>
              </div>
            </div>
          )}
        </>
      ) : (
        <>
          <h2 className="text-2xl font-bold mb-4">Import Wallet</h2>
          <WalletOptions
            importOption={importOption}
            setImportOption={setImportOption}
            seedPhrase={seedPhrase}
            handleSeedPhraseChange={handleSeedPhraseChange}
            connectWallet={connectWallet}
          />
          {success && (
            <div className="flex items-center w-64 space-x-2 text-green-600">
              <FaCheckCircle />
              <p>Wallet connected successfully!</p>
            </div>
          )}
          {error && (
            <div className="text-sm text-red-600">
              <p>{error}</p>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ImportWallet;
