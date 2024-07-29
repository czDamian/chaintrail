"use client";
import { useEffect, useState } from "react";
import { ethers } from "ethers";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const JWT = "YOUR_JWT_HERE";

const Web3WalletConnect = () => {
  const [walletAddress, setWalletAddress] = useState("");
  const [walletBalance, setWalletBalance] = useState("");
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    if (localStorage.getItem("connected") === "true") {
      setWalletAddress(localStorage.getItem("address"));
      setWalletBalance(localStorage.getItem("balance"));
      setConnected(true);
    }
  }, []);

  const connectWallet = async () => {
    if (typeof window.ethereum !== "undefined") {
      try {
        const coreTestnetId = "0x45B";
        const networkId = await ethereum.request({ method: "net_version" });

        if (networkId !== coreTestnetId) {
          try {
            await ethereum.request({
              method: "wallet_switchEthereumChain",
              params: [{ chainId: coreTestnetId }],
            });
          } catch (switchError) {
            if (switchError.code === 4902) {
              try {
                await ethereum.request({
                  method: "wallet_addEthereumChain",
                  params: [
                    {
                      chainId: coreTestnetId,
                      chainName: "Core Testnet",
                      rpcUrls: ["https://rpc.test.btcs.network"],
                      nativeCurrency: {
                        name: "Core",
                        symbol: "tCORE",
                        decimals: 18,
                      },
                      blockExplorerUrls: ["https://scan.test.btcs.network"],
                    },
                  ],
                });
              } catch (addError) {
                console.error("Error adding Core testnet:", addError);
                toast.error(
                  "Failed to add Core testnet to MetaMask. Please try again."
                );
                return;
              }
            } else {
              console.error("Error switching to Core testnet:", switchError);
              toast.error(
                "Failed to switch to Core testnet. Please try again."
              );
              return;
            }
          }
        }

        await ethereum.request({ method: "eth_requestAccounts" });
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const address = await signer.getAddress();
        const shortAddress = `${address.slice(0, 5)}...${address.slice(-5)}`;
        const balance = await provider.getBalance(address);
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
    } else {
      toast.error(
        "MetaMask is not installed. Please install MetaMask and try again."
      );
    }
  };

  const pinFileToIPFS = async () => {
    const fileInput = document.getElementById("fileInput");
    const file = fileInput.files[0];

    if (!file) {
      toast.error("No file selected. Please select a file to upload.");
      return;
    }

    const reader = new FileReader();
    reader.readAsArrayBuffer(file);

    reader.onloadend = async () => {
      const arrayBuffer = reader.result;
      const base64File = btoa(
        new Uint8Array(arrayBuffer)
          .reduce((data, byte) => data + String.fromCharCode(byte), "")
      );

      const requestBody = JSON.stringify({
        file: base64File,
        pinataMetadata: { name: "File name" },
        pinataOptions: { cidVersion: 0 },
      });

      try {
        const res = await fetch("https://api.pinata.cloud/pinning/pinFileToIPFS", {
          method: "POST",
          body: requestBody,
          headers: {
            Authorization: `Bearer ${JWT}`,
            "Content-Type": "application/json",
          },
        });

        const data = await res.json();
        console.log(data);
        toast.success("File pinned to IPFS successfully!");
      } catch (error) {
        console.error("Error pinning file to IPFS:", error);
        toast.error("Error pinning file to IPFS. Please try again.");
      }
    };
  };

  useEffect(() => {
    pinFileToIPFS();
  }, []);

  return (
    <div className="min-h-screen bg-neutral-900 text-yellow-500 p-5">
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
      <input type="file" id="fileInput" className="mt-4" />
      <h1 className="text-2xl font-bold mt-6">My NFTs</h1>
      <div id="nftContainer" className="mt-4"></div>
    </div>
  );
};

export default Web3WalletConnect;
