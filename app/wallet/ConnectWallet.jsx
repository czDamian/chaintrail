"use client";
import Web3Modal from "web3modal";
import { ethers } from "ethers";
import { useState, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import WalletConnectProvider from "@walletconnect/web3-provider";

const CORE_TESTNET_CHAIN_ID = "0x45b"; // Chain ID for Core Testnet

const Web3WalletConnect = () => {
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [walletAddress, setWalletAddress] = useState("");
  const [walletBalance, setWalletBalance] = useState("");
  const [web3Modal, setWeb3Modal] = useState(null);

  useEffect(() => {
    const newWeb3Modal = new Web3Modal({
      cacheProvider: false,
      providerOptions: {
        walletconnect: {
          package: WalletConnectProvider,
          options: {
            rpc: {
              1116: "https://rpc.test.btcs.network",
            },
            qrcode: true,
            qrcodeModalOptions: {
              mobileLinks: [
                "metamask",
                "trust",
                "rainbow",
                "argent",
                "imtoken",
              ],
            },
          },
        },
      },
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

  const switchToCoreTestnet = async () => {
    try {
      await provider.send("wallet_switchEthereumChain", [
        { chainId: CORE_TESTNET_CHAIN_ID },
      ]);
    } catch (switchError) {
      if (switchError.code === 4902) {
        try {
          await provider.send("wallet_addEthereumChain", [
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

  const isMobile = () => {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    );
  };

  const connectWallet = async () => {
    try {
      let instance;
      if (isMobile()) {
        instance = await web3Modal.connectTo("walletconnect");
      } else {
        instance = await web3Modal.connect();
      }

      const web3Provider = new ethers.BrowserProvider(instance);

      // Ensure the user is connected before proceeding
      await web3Provider.send("eth_requestAccounts", []);

      const network = await web3Provider.getNetwork();
      if (network.chainId.toString(16) !== CORE_TESTNET_CHAIN_ID.slice(2)) {
        await switchToCoreTestnet();
        const updatedProvider = new ethers.BrowserProvider(instance);
        setProvider(updatedProvider);
      } else {
        setProvider(web3Provider);
      }

      const walletSigner = await web3Provider.getSigner();
      setSigner(walletSigner);
      const address = await walletSigner.getAddress();
      setWalletAddress(address);
      toast.success("Connected to wallet successfully!");

      // Set up event listeners for disconnect and account change
      instance.on("disconnect", () => {
        disconnectWallet();
      });

      instance.on("accountsChanged", (accounts) => {
        if (accounts.length === 0) {
          disconnectWallet();
        } else {
          setWalletAddress(accounts[0]);
        }
      });
    } catch (error) {
      console.error("Error connecting to wallet:", error);
      if (isMobile()) {
        if (error.message.includes("User rejected")) {
          toast.error("Connection rejected. Please try again.");
        } else if (error.message.includes("No provider found")) {
          toast.error(
            "No compatible wallet found. Please install a Web3 wallet app."
          );
        } else {
          toast.error(
            "Error connecting on mobile. Please try again or use a desktop browser."
          );
        }
      } else {
        toast.error("Error connecting to wallet. Please try again.");
      }
    }
  };

  const disconnectWallet = () => {
    setProvider(null);
    setSigner(null);
    setWalletAddress("");
    setWalletBalance("");

    // Clear the cached provider
    if (web3Modal) {
      web3Modal.clearCachedProvider();
    }

    toast.success("Disconnected from wallet successfully!");
  };

  const trimWalletAddress = (address) => {
    return `${address.slice(0, 5)}...${address.slice(-5)}`;
  };

  useEffect(() => {
    fetchBalance();
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
            Connect with Wallet
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

export default Web3WalletConnect;
