"use client";

import { useEffect, useState } from "react";
import { ethers } from "ethers";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Web3WalletConnect = () => {
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [walletAddress, setWalletAddress] = useState("");
  const [walletBalance, setWalletBalance] = useState("");

  const CORE_TESTNET_CHAIN_ID = "0x45b"; // Chain ID for Core Testnet

  useEffect(() => {
    if (provider && walletAddress) {
      fetchBalance();
    }
  }, [provider, walletAddress]);

  const fetchBalance = async () => {
    try {
      const balance = await provider.getBalance(walletAddress);
      const balanceInCore = ethers.formatEther(balance);
      setWalletBalance(`${balanceInCore} CORE`);
    } catch (error) {
      console.error("Error fetching balance:", error);
      toast.error("Error fetching balance. Please try again.");
    }
  };

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
          toast.error("Failed to add Core Testnet. Please add it manually.");
        }
      } else {
        console.error("Error switching to Core Testnet:", switchError);
        toast.error(
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

        toast.success("Connected to wallet successfully!");
      } else {
        toast.error("No web3 provider found. Please install MetaMask.");
      }
    } catch (error) {
      console.error("Error connecting to wallet:", error);
      toast.error("Error connecting to wallet. Please try again.");
    }
  };

  const disconnectWallet = () => {
    setProvider(null);
    setSigner(null);
    setWalletAddress("");
    setWalletBalance("");
    toast.success("Disconnected from wallet successfully!");
  };

  const trimWalletAddress = (address) => {
    return `${address.slice(0, 5)}...${address.slice(-5)}`;
  };

  return (
    <div className="bg-neutral-900 my-6 p-5">
      <ToastContainer />
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
      {/* <h1 className="text-2xl font-bold mt-6">My NFTs</h1> */}
      <div id="nftContainer" className="mt-4"></div>
    </div>
  );
};

export default Web3WalletConnect;
