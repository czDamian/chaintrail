"use client";
import { useEffect, useState, useCallback } from "react";
import { ethers } from "ethers";
import Button from "../components/Reusable/Button";
import { CgClose } from "react-icons/cg";
import { IoCopy } from "react-icons/io5";

const ErrorMessage = ({ message, onClose }) => (
  <div className="fixed mx-4 rounded text-xs top-16 left-0 right-0 bg-green-600 p-2 md:p-4 text-center">
    <p>{message}</p>
    <button
      onClick={onClose}
      className="absolute text-2xl top-1 right-2 text-white hover:text-gray-300">
      <CgClose />
    </button>
  </div>
);

const Web3WalletConnect = () => {
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [walletAddress, setWalletAddress] = useState("");
  const [walletBalance, setWalletBalance] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [showInstallMetamaskPopup, setShowInstallMetamaskPopup] =
    useState(false);
  const [copyButtonText, setCopyButtonText] = useState("Copy Link");

  const CORE_TESTNET_CHAIN_ID = "0x45b";

  const fetchBalance = useCallback(async () => {
    if (!provider || !walletAddress) {
      console.error("Provider or wallet address is not set");
      return;
    }

    try {
      const balance = await provider.getBalance(walletAddress);
      const balanceInCore = ethers.formatEther(balance);
      setWalletBalance(`${balanceInCore} CORE`);
    } catch (error) {
      console.error("Error fetching balance:", error);
      setErrorMessage("Error fetching balance. Please try again.");
    }
  }, [provider, walletAddress]);

  useEffect(() => {
    const savedAddress = localStorage.getItem("walletAddress");
    if (savedAddress) {
      setWalletAddress(savedAddress);
      const web3Provider = new ethers.BrowserProvider(window.ethereum);
      setProvider(web3Provider);
    } else if (window.ethereum) {
      connectWallet();
    } else {
      setShowInstallMetamaskPopup(true);
    }
  }, []);

  useEffect(() => {
    if (provider && walletAddress) {
      fetchBalance();
    }
  }, [provider, walletAddress, fetchBalance]);

  const switchToCoreTestnet = async () => {
    try {
      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: CORE_TESTNET_CHAIN_ID }],
      });
    } catch (switchError) {
      if (switchError.code === 4902) {
        try {
          await window.ethereum.request({
            method: "wallet_addEthereumChain",
            params: [
              {
                chainId: CORE_TESTNET_CHAIN_ID,
                chainName: "Core Testnet",
                nativeCurrency: {
                  name: "tCore",
                  symbol: "tCORE",
                  decimals: 18,
                },
                rpcUrls: ["https://rpc.test.btcs.network"],
                blockExplorerUrls: ["https://scan.test.btcs.network"],
              },
            ],
          });
        } catch (addError) {
          console.error("Error adding Core Testnet:", addError);
          setErrorMessage(
            "Failed to add Core Testnet. Please add it manually."
          );
        }
      } else {
        console.error("Error switching to Core Testnet:", switchError);
        setErrorMessage(
          "Failed to switch to Core Testnet. Please switch manually."
        );
      }
    }
  };

  const connectWallet = async () => {
    try {
      if (window.ethereum) {
        const web3Provider = new ethers.BrowserProvider(window.ethereum);
        await web3Provider.send("eth_requestAccounts", []);

        const network = await web3Provider.getNetwork();

        if (network.chainId.toString(16) !== CORE_TESTNET_CHAIN_ID.slice(2)) {
          await switchToCoreTestnet();
          const updatedProvider = new ethers.BrowserProvider(window.ethereum);
          setProvider(updatedProvider);
        } else {
          setProvider(web3Provider);
        }

        const walletSigner = await web3Provider.getSigner();
        setSigner(walletSigner);

        const address = await walletSigner.getAddress();
        setWalletAddress(address);
        localStorage.setItem("walletAddress", address); // Save to local storage
        console.log("Wallet Address:", address);
      } else {
        setShowInstallMetamaskPopup(true);
      }
    } catch (error) {
      console.error("Error connecting to wallet:", error);
      setErrorMessage("Error connecting to wallet. Please try again.");
    }
  };

  const disconnectWallet = () => {
    setProvider(null);
    setSigner(null);
    setWalletAddress("");
    setWalletBalance("");
    localStorage.removeItem("walletAddress"); // Remove from local storage
    console.log("Wallet Disconnected!");
  };

  const trimWalletAddress = (address) => {
    return `${address.slice(0, 5)}...${address.slice(-5)}`;
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText("https://chaintrail.vercel.app");
    setCopyButtonText("Copied");
    setTimeout(() => setCopyButtonText("Copy Link"), 2000);
  };

  return (
    <div className="bg-neutral-900 rounded-lg my-6 p-5">
      {errorMessage && (
        <ErrorMessage
          message={errorMessage}
          onClose={() => setErrorMessage("")}
        />
      )}
      <div className="container mx-auto text-center bg-neutral-800 p-6 rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold mb-4">Connect Your Core Wallet</h1>
        <p>
          Only Core Testnet is supported. You will be prompted to switch if
          necessary.
        </p>
        {!walletAddress ? (
          <div>
            <Button
              className="mt-4 bg-gold-500 text-black text-xs hover:bg-yellow-600"
              onClick={connectWallet}>
              Connect Wallet
            </Button>
          </div>
        ) : (
          <div>
            <p className="mt-4">{`Connected: ${trimWalletAddress(
              walletAddress
            )}`}</p>
            <p className="mt-2">{`Balance: ${walletBalance}`}</p>
            <Button
              className="mt-4 bg-red-500 text-black text-xs hover:bg-red-600"
              onClick={disconnectWallet}>
              Disconnect
            </Button>
          </div>
        )}
      </div>
      {showInstallMetamaskPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-slate-950 rounded-lg shadow-xl p-4 w-80 relative">
            <button
              onClick={() => setShowInstallMetamaskPopup(false)}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700">
              <CgClose />
            </button>
            <p className="text-white text-center mb-4">
              MetaMask not installed!
            </p>
            <div className="flex justify-center">
              <Button
                onClick={handleCopyLink}
                className="flex items-center gap-1 border border-white bg-black hover:border-gold-500 text-xs">
                <IoCopy /> {copyButtonText}
              </Button>
            </div>
          </div>
        </div>
      )}
      <div id="nftContainer" className="mt-4"></div>
    </div>
  );
};

export default Web3WalletConnect;
