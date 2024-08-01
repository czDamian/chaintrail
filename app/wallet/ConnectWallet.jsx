"use client";

import { useEffect, useState, useCallback } from "react";
import { ethers } from "ethers";

const ErrorMessage = ({ message, onClose }) => (
  <div className="fixed top-0 left-0 right-0 bg-red-500 text-white p-4 text-center">
    <p>{message}</p>
    <button onClick={onClose} className="absolute top-2 right-2 text-white">
      ✕
    </button>
  </div>
);

const Web3WalletConnect = () => {
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [walletAddress, setWalletAddress] = useState("");
  const [walletBalance, setWalletBalance] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const CORE_TESTNET_CHAIN_ID = "0x45b";

  const fetchBalance = useCallback(async () => {
    if (!provider || !walletAddress) {
      console.error("Provider or wallet address is not set");
      return;
    }

    console.log("Fetching balance for address:", walletAddress);

    try {
      const balance = await provider.getBalance(walletAddress);
      console.log("Balance fetched:", balance);
      const balanceInCore = ethers.formatEther(balance);
      setWalletBalance(`${balanceInCore} CORE`);
    } catch (error) {
      console.error("Error fetching balance:", error);
      setErrorMessage("Error fetching balance. Please try again.");
    }
  }, [provider, walletAddress]);

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
        console.log("Connected network:", network);

        if (network.chainId.toString(16) !== CORE_TESTNET_CHAIN_ID.slice(2)) {
          await switchToCoreTestnet();
          const updatedProvider = new ethers.BrowserProvider(window.ethereum);
          setProvider(updatedProvider);
          console.log("Switched to Core Testnet");
        } else {
          setProvider(web3Provider);
          console.log("Using existing provider");
        }

        const walletSigner = await web3Provider.getSigner();
        setSigner(walletSigner);

        const address = await walletSigner.getAddress();
        setWalletAddress(address);
        console.log("Wallet Address:", address);

        console.log("Connected to wallet successfully!");
      } else {
        setErrorMessage("Copy the link and open it in metamask.");
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
    console.log("Disconnected from wallet successfully!");
  };

  const trimWalletAddress = (address) => {
    return `${address.slice(0, 5)}...${address.slice(-5)}`;
  };

  return (
    <div className="bg-neutral-900 my-6 p-5">
      {errorMessage && (
        <ErrorMessage
          message={errorMessage}
          onClose={() => setErrorMessage("")}
        />
      )}
      <div className="container mx-auto text-center bg-neutral-800 p-6 rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold mb-4">Connect to Web3 Wallet</h1>
        <p>
          Only Core Testnet is supported. You will be prompted to switch if
          necessary.
        </p>
        {!walletAddress ? (
          <div>
            <button
              className="mt-4 bg-yellow-500 text-neutral-900 px-4 py-2 rounded-lg shadow hover:bg-yellow-600 mr-2"
              onClick={connectWallet}>
              Connect with MetaMask
            </button>
          </div>
        ) : (
          <div>
            <p className="mt-4">{`Connected: ${trimWalletAddress(
              walletAddress
            )}`}</p>
            <p className="mt-2">{`Balance: ${walletBalance}`}</p>
            <button
              className="mt-4 bg-red-500 text-white px-4 py-2 rounded-lg shadow hover:bg-red-600"
              onClick={disconnectWallet}>
              Disconnect Wallet
            </button>
          </div>
        )}
      </div>
      <div id="nftContainer" className="mt-4"></div>
    </div>
  );
};

export default Web3WalletConnect;
