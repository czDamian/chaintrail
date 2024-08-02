"use client";

import { useEffect, useState, useCallback } from "react";
import { ethers } from "ethers";
import Button from "../components/Reusable/Button";
import { CgClose } from "react-icons/cg";
const ErrorMessage = ({ message, onClose }) => (
  <div className="fixed text-xs top-14 left-0 right-0 bg-red-500 text-black p-2 md:p-4 text-center">
    <p>{message}</p>
    <button
      onClick={onClose}
      className="absolute text-black text-2xl top-1 right-2">
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
        console.log("Wallet Address:", address);
      } else {
        setErrorMessage("Copy the link and open it in your metamask.");
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
    console.log("wallet Disconnected!");
  };

  const trimWalletAddress = (address) => {
    return `${address.slice(0, 5)}...${address.slice(-5)}`;
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
        <h1 className="text-2xl font-bold mb-4">Connect to Web3 Wallet</h1>
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
      <div id="nftContainer" className="mt-4"></div>
    </div>
  );
};

export default Web3WalletConnect;
