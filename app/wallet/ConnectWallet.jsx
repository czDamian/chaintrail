"use client";
import { useEffect, useState } from "react";
import { ethers } from "ethers";
import { ToastContainer, toast } from "react-toastify";
import { Web3ReactProvider, useWeb3React } from "@web3-react/core";
import { InjectedConnector } from "@web3-react/injected-connector";
import { WalletConnectConnector } from "@web3-react/walletconnect-connector";
import "react-toastify/dist/ReactToastify.css";

const injected = new InjectedConnector({
  supportedChainIds: [1, 4, 1115], // Mainnet, Rinkeby, Core Testnet
});

const walletconnect = new WalletConnectConnector({
  rpc: {
    1: "https://ethereum.publicnode.com",
    4: "https://rinkeby.publicnode.com",
    1115: "https://rpc.test.btcs.network",
  },
  qrcode: true,
});

const Web3WalletConnectComponent = () => {
  const { active, account, library, activate, deactivate } = useWeb3React();
  const [walletAddress, setWalletAddress] = useState("");
  const [walletBalance, setWalletBalance] = useState("");

  useEffect(() => {
    if (active && account) {
      const shortAddress = `${account.slice(0, 5)}...${account.slice(-5)}`;
      setWalletAddress(shortAddress);
      fetchBalance();
    } else {
      setWalletAddress("");
      setWalletBalance("");
    }
  }, [active, account, library]);

  const fetchBalance = async () => {
    if (library && account) {
      try {
        const balance = await library.getBalance(account);
        const balanceInEther = ethers.utils.formatEther(balance);
        setWalletBalance(`${balanceInEther} CORE`);
      } catch (error) {
        console.error("Error fetching balance:", error);
        toast.error("Error fetching balance. Please try again.");
      }
    }
  };

  const connectWallet = async (connectorType) => {
    try {
      if (connectorType === "injected") {
        await activate(injected);
      } else if (connectorType === "walletconnect") {
        await activate(walletconnect);
      }
      toast.success("Connected to wallet successfully!");
    } catch (error) {
      console.error("Error connecting to wallet:", error);
      toast.error("Error connecting to wallet. Please try again.");
    }
  };

  const disconnectWallet = async () => {
    try {
      deactivate();
      toast.success("Disconnected from wallet successfully!");
    } catch (error) {
      console.error("Error disconnecting wallet:", error);
      toast.error("Error disconnecting wallet. Please try again.");
    }
  };

  return (
    <div className="bg-neutral-900 my-6 p-5">
      <ToastContainer />
      <div className="container mx-auto text-center bg-neutral-800 p-6 rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold mb-4">Connect to Web3 Wallet</h1>
        <p>
          After connecting, you may need to switch networks manually to access the Core testnet
        </p>
        {!active ? (
          <div>
            <button
              className="mt-4 bg-yellow-500 text-neutral-900 px-4 py-2 rounded-lg shadow hover:bg-yellow-600 mr-2"
              onClick={() => connectWallet("injected")}
            >
              Connect with MetaMask
            </button>
            <button
              className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-600"
              onClick={() => connectWallet("walletconnect")}
            >
              Connect with WalletConnect
            </button>
          </div>
        ) : (
          <div>
            <p className="mt-4">{`Connected: ${walletAddress}`}</p>
            <p className="mt-2">{`Balance: ${walletBalance}`}</p>
            <button
              className="mt-4 bg-red-500 text-white px-4 py-2 rounded-lg shadow hover:bg-red-600"
              onClick={disconnectWallet}
            >
              Disconnect Wallet
            </button>
          </div>
        )}
      </div>
      <h1 className="text-2xl font-bold mt-6">My NFTs</h1>
      <div id="nftContainer" className="mt-4"></div>
    </div>
  );
};

const Web3WalletConnect = () => {
  return (
    <Web3ReactProvider getLibrary={(provider) => new ethers.providers.Web3Provider(provider)}>
      <Web3WalletConnectComponent />
    </Web3ReactProvider>
  );
};

export default Web3WalletConnect;
