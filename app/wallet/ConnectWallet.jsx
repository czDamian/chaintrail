"use client";
import { useEffect, useState } from "react";
import { ethers } from "ethers";
import { ToastContainer, toast } from "react-toastify";
import WalletConnectProvider from "@walletconnect/web3-provider";
import "react-toastify/dist/ReactToastify.css";

const Web3WalletConnect = () => {
  const [walletAddress, setWalletAddress] = useState("");
  const [walletBalance, setWalletBalance] = useState("");
  const [connected, setConnected] = useState(false);
  const [provider, setProvider] = useState(null);

  useEffect(() => {
    if (localStorage.getItem("connected") === "true") {
      setWalletAddress(localStorage.getItem("address"));
      setWalletBalance(localStorage.getItem("balance"));
      setConnected(true);
    }
  }, []);

  const connectWallet = async () => {
    try {
      // Create WalletConnect Provider with a public RPC URL
      const walletConnectProvider = new WalletConnectProvider({
        rpc: {
          1: "https://mainnet.infura.io/v3/YOUR_INFURA_PROJECT_ID", // Mainnet
          4: "https://rinkeby.infura.io/v3/YOUR_INFURA_PROJECT_ID", // Rinkeby
          1115: "https://rpc.test.btcs.network" // Core Testnet
        },
        qrcodeModalOptions: {
          mobileLinks: ["metamask", "trust", "okx", "bybit"], // List of supported wallets
        },
      });

      // Enable session (triggers QR Code modal)
      await walletConnectProvider.enable();

      const ethersProvider = new ethers.providers.Web3Provider(walletConnectProvider);
      setProvider(ethersProvider);

      const signer = ethersProvider.getSigner();
      const address = await signer.getAddress();
      const shortAddress = `${address.slice(0, 5)}...${address.slice(-5)}`;
      const balance = await ethersProvider.getBalance(address);
      const balanceInEther = ethers.utils.formatEther(balance);

      setWalletAddress(shortAddress);
      setWalletBalance(`${balanceInEther} CORE`);
      setConnected(true);

      localStorage.setItem("connected", "true");
      localStorage.setItem("address", shortAddress);
      localStorage.setItem("balance", balanceInEther);

      toast.success("Connected to wallet successfully!");
    } catch (error) {
      console.error("Error connecting to wallet:", error);
      toast.error("Error connecting to wallet. Please try again.");
    }
  };

  return (
    <div className="bg-neutral-900 my-6 p-5">
      <ToastContainer />
      <div className="container mx-auto text-center bg-neutral-800 p-6 rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold mb-4">Connect to Web3 Wallet</h1>
        <p>
          After connecting, click on connect wallet again to switch to Core
          testnet
        </p>
        {!connected ? (
          <button
            id="connectButton"
            className="mt-4 bg-yellow-500 text-neutral-900 px-4 py-2 rounded-lg shadow hover:bg-yellow-600"
            onClick={connectWallet}
          >
            Connect Wallet
          </button>
        ) : (
          <div>
            <p
              id="walletAddress"
              className="mt-4">{`Connected: ${walletAddress}`}</p>
            <p
              id="walletBalance"
              className="mt-2">{`Balance: ${walletBalance}`}</p>
          </div>
        )}
      </div>
      <h1 className="text-2xl font-bold mt-6">My NFTs</h1>
      <div id="nftContainer" className="mt-4"></div>
    </div>
  );
};

export default Web3WalletConnect;
