"use client";
import { useEffect, useState } from "react";
import { ethers } from "ethers";
import { ToastContainer, toast } from "react-toastify";
import { useWeb3React, Web3ReactProvider } from "@web3-react/core";
import { InjectedConnector } from "@web3-react/injected-connector";
import { WalletConnectConnector } from "@web3-react/walletconnect-connector";
import "react-toastify/dist/ReactToastify.css";

const injected = new InjectedConnector({
  supportedChainIds: [1, 3, 4, 5, 42, 1115], // Add chain IDs you want to support, including Core Testnet
});

const walletConnect = new WalletConnectConnector({
  rpc: {
    1: "https://mainnet.infura.io/v3/YOUR_INFURA_PROJECT_ID",
    4: "https://rinkeby.infura.io/v3/YOUR_INFURA_PROJECT_ID",
    1115: "https://rpc.test.btcs.network", // Core Testnet
  },
  bridge: "https://bridge.walletconnect.org",
  qrcode: true,
  pollingInterval: 12000,
});

const Web3WalletConnectComponent = () => {
  const { activate, active, account, library, chainId } = useWeb3React();
  const [walletBalance, setWalletBalance] = useState("");

  useEffect(() => {
    if (active && account && library) {
      const fetchBalance = async () => {
        const balance = await library.getBalance(account);
        setWalletBalance(ethers.utils.formatEther(balance));
      };

      fetchBalance();
    }
  }, [active, account, library]);

  const connectWallet = async (connector) => {
    try {
      await activate(connector);
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
        {!active ? (
          <>
            <button
              className="mt-4 bg-yellow-500 text-neutral-900 px-4 py-2 rounded-lg shadow hover:bg-yellow-600"
              onClick={() => connectWallet(injected)}
            >
              Connect MetaMask
            </button>
            <button
              className="mt-4 bg-yellow-500 text-neutral-900 px-4 py-2 rounded-lg shadow hover:bg-yellow-600"
              onClick={() => connectWallet(walletConnect)}
            >
              Connect WalletConnect
            </button>
          </>
        ) : (
          <div>
            <p className="mt-4">{`Connected: ${account}`}</p>
            <p className="mt-2">{`Balance: ${walletBalance} ETH`}</p>
            <p className="mt-2">{`Network: ${chainId === 1115 ? 'Core Testnet' : chainId}`}</p>
          </div>
        )}
      </div>
      <h1 className="text-2xl font-bold mt-6">My NFTs</h1>
      <div id="nftContainer" className="mt-4"></div>
    </div>
  );
};

const Web3WalletConnect = () => (
  <Web3ReactProvider getLibrary={(provider)
