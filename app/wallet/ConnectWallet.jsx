"use client";
import { useState, useEffect } from "react";
import { ethers } from "ethers";
import Web3Modal from "web3modal";
import WalletConnectProvider from "@walletconnect/web3-provider";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const CORE_TESTNET_CHAIN_ID = 1115; // Chain ID for Core Testnet
const CORE_TESTNET_RPC_URL = "https://rpc.test.btcs.network";

const Web3ModalConnect = () => {
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [walletAddress, setWalletAddress] = useState("");
  const [walletBalance, setWalletBalance] = useState("");
  const [web3Modal, setWeb3Modal] = useState(null);

  useEffect(() => {
    const providerOptions = {
      walletconnect: {
        package: WalletConnectProvider,
        options: {
          rpc: {
            [CORE_TESTNET_CHAIN_ID]: CORE_TESTNET_RPC_URL,
          },
        },
      },
    };

    const newWeb3Modal = new Web3Modal({
      cacheProvider: true,
      providerOptions,
    });

    setWeb3Modal(newWeb3Modal);
  }, []);

  const fetchBalance = async () => {
    try {
      if (provider && walletAddress) {
        const balance = await provider.getBalance(walletAddress);
        const balanceInCore = ethers.formatEther(balance);
        setWalletBalance(`${balanceInCore} CORE`);
      }
    } catch (error) {
      console.error("Error fetching balance:", error);
      toast.error("Error fetching balance. Please try again.");
    }
  };

  const switchToCoreTestnet = async (provider) => {
    try {
      await provider.send("wallet_switchEthereumChain", [
        { chainId: `0x${CORE_TESTNET_CHAIN_ID.toString(16)}` },
      ]);
    } catch (switchError) {
      if (switchError.code === 4902) {
        try {
          await provider.send("wallet_addEthereumChain", [
            {
              chainId: `0x${CORE_TESTNET_CHAIN_ID.toString(16)}`,
              chainName: "Core Testnet",
              nativeCurrency: {
                name: "tCore",
                symbol: "tCORE",
                decimals: 18,
              },
              rpcUrls: [CORE_TESTNET_RPC_URL],
              blockExplorerUrls: ["https://scan.test.btcs.network"],
            },
          ]);
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
      const instance = await web3Modal.connect();
      const web3Provider = new ethers.BrowserProvider(instance);
      const signer = await web3Provider.getSigner();
      const address = await signer.getAddress();

      setProvider(web3Provider);
      setSigner(signer);
      setWalletAddress(address);

      await switchToCoreTestnet(web3Provider);

      instance.on("accountsChanged", async (accounts) => {
        const newSigner = await web3Provider.getSigner();
        setSigner(newSigner);
        setWalletAddress(accounts[0]);
      });

      instance.on("chainChanged", () => {
        window.location.reload();
      });

      toast.success("Connected to wallet successfully!");
      await fetchBalance();
    } catch (error) {
      console.error("Error connecting to wallet:", error);
      toast.error("Error connecting to wallet. Please try again.");
    }
  };

  const disconnectWallet = async () => {
    if (web3Modal) {
      await web3Modal.clearCachedProvider();
    }
    setProvider(null);
    setSigner(null);
    setWalletAddress("");
    setWalletBalance("");
    toast.success("Disconnected from wallet successfully!");
  };

  const trimWalletAddress = (address) => {
    return `${address.slice(0, 5)}...${address.slice(-5)}`;
  };

  useEffect(() => {
    if (provider && walletAddress) {
      fetchBalance();
    }
  }, [provider, walletAddress]);

  return (
    <div className="bg-neutral-900 my-6 p-3 sm:p-5">
      <ToastContainer />
      <div className="container mx-auto text-center bg-neutral-800 p-4 sm:p-6 rounded-lg shadow-lg">
        <h1 className="text-xl sm:text-2xl font-bold mb-4">
          Connect to Web3 Wallet
        </h1>
        <p className="text-sm sm:text-base">
          Only Core Testnet is supported. You will be prompted to switch if
          necessary.
        </p>
        {!walletAddress ? (
          <button
            className="mt-4 bg-yellow-500 text-neutral-900 px-4 py-2 rounded-lg shadow hover:bg-yellow-600 text-sm sm:text-base"
            onClick={connectWallet}>
            Connect Wallet
          </button>
        ) : (
          <div>
            <p className="mt-4 text-sm sm:text-base">{`Connected: ${trimWalletAddress(
              walletAddress
            )}`}</p>
            <p className="mt-2 text-sm sm:text-base">{`Balance: ${walletBalance}`}</p>
            <button
              className="mt-4 bg-red-500 text-white px-4 py-2 rounded-lg shadow hover:bg-red-600 text-sm sm:text-base"
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

export default Web3ModalConnect;
